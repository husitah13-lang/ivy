import React from 'react';
import './ArticleInBrief.css';

const ArticleInBrief = ({ points }) => {
  if (!points || points.length === 0) return null;

  return (
    <section className="article-in-brief">
      <div className="article-in-brief-container">
        <h2 className="article-in-brief-title">In brief</h2>
        <ul className="article-in-brief-list">
          {points.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ArticleInBrief;
