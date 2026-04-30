import React from 'react';
import './ArticleTextSection.css';

const ArticleTextSection = ({ title, paragraphs }) => {
  if (!title && (!paragraphs || paragraphs.length === 0)) return null;

  return (
    <section className="article-text-section">
      <div className="article-text-container">
        {title && <h2 className="article-text-title">{title}</h2>}
        {paragraphs && paragraphs.map((para, index) => (
          <p key={index} className="article-text-paragraph">{para}</p>
        ))}
      </div>
    </section>
  );
};

export default ArticleTextSection;
