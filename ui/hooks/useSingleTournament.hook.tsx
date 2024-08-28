"use client";

import { useToast } from "@/components/ui/use-toast";
import { database } from "@/lib/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useSingleTournament({ id }: { id: string }) {
  const [tournament, setTournament] = useState<any>(null);

  const { toast } = useToast();
  const router = useRouter();

  // Firebase
  useEffect(() => {
    const matchsRef = ref(database, `tournaments/${id}`);

    const unsubscribe = onValue(matchsRef, (snapshot) => {
      const data: any = snapshot.val();

      if (!data) {
        setTournament(null);
        router.replace("/");
        toast({
          title: "Greška!",
          description: `Meč ${id} ne postoji!`,
          variant: "destructive",
        });
      }

      setTournament(data);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return { tournament };
}
