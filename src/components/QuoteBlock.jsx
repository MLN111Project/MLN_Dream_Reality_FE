import { motion } from 'framer-motion';
import './QuoteBlock.css';

export default function QuoteBlock({ quote, author, align = 'center' }) {
  return (
    <motion.blockquote
      className={`quote-block quote-block--${align}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
    >
      <span className="quote-block__mark">"</span>
      <p className="quote-block__text">{quote}</p>
      {author && <cite className="quote-block__author">— {author}</cite>}
    </motion.blockquote>
  );
}
