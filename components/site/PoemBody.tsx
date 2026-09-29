"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function PoemBody({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const lines = text.replace(/\r\n/g, "\n").split("\n");

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready || reduce) {
    return (
      <div className="poem">
        {lines.map((line, index) => (
          <span className="poem-line" key={index}>
            {line || "\u00A0"}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="poem">
      {lines.map((line, index) => (
        <motion.span
          className="poem-line"
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: Math.min(index * 0.035, 0.7), ease: [0.22, 1, 0.36, 1] }}
        >
          {line || "\u00A0"}
        </motion.span>
      ))}
    </div>
  );
}
