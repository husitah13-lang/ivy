import React from 'react';
import './ArticleNumberedListSection.css';

const ArticleNumberedListSection = ({ title, intro, items }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="article-numbered-section">
      <div className="article-numbered-container">
        {title && <h2 className="article-numbered-title">{title}</h2>}
        {intro && <p className="article-numbered-intro">{intro}</p>}
        
        <div className="article-numbered-list">
          {items.map((item, index) => (
            <div key={index} className="article-numbered-item">
              <div className="article-numbered-index">{index + 1}.</div>
              <div className="article-numbered-content">
                {item.title && <strong>{item.title} </strong>}
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticleNumberedListSection;
