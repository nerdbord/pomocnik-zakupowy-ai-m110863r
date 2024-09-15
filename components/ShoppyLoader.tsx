import React, { useState, useEffect } from "react";

interface Fact {
  id: number;
  text: string;
}

const facts: Fact[] = [
  {
    id: 1,
    text: "Ładowanie... Szkoda, że nie idzie tak szybko, jak nasze umiejętności programistyczne!",
  },
  { id: 2, text: "Ładowanie zabawy... Trzymaj się!" },
  { id: 3, text: "Jeszcze chwilka... Może kawa w międzyczasie?" },
  { id: 4, text: "Tworzymy magię... Chyba." },
  {
    id: 5,
    text: "Jesteśmy pewni w 99%, że to zadziała... Pozostały 1% to debugowanie.",
  },
  { id: 6, text: "Obiecujemy, że się nie zawiesiło..." },
  {
    id: 7,
    text: "Ładowanie... Kod jest jak pizza, lepszy, gdy dostarczony na gorąco!",
  },
  { id: 7, text: "Ładowanie... Na naszym komputerze działało!" },
];

const ShoppyLoader: React.FC = () => {
  const [fact, setFact] = useState<Fact | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      setFact(randomFact);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4 "></div>
      <h2 className="text-2xl font-bold mb-4">
        Ładowanie{" "}
        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          Shoppy
        </span>
        ...
      </h2>
      <div className="max-w-md text-center">
        <p className="italic">{fact?.text}</p>
      </div>
    </div>
  );
};

export default ShoppyLoader;
