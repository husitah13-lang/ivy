import React from 'react';
import './ArticleHero.css';

const ArticleHero = ({ eyebrow, title, subtitle, readTime, date, authors }) => {
  return (
    <section className="article-hero">
      <div className="article-hero-container">
        
        <div className="article-hero-content">
          <div className="article-hero-eyebrow">{eyebrow}</div>
          <h1 className="article-hero-title">{title}</h1>
          <h2 className="article-hero-subtitle">{subtitle}</h2>
          
          <div className="article-hero-meta">
            <span>{readTime}</span>
            <span>{date}</span>
          </div>
          
          <div className="article-hero-gradient-line"></div>
        </div>

        <div className="article-hero-sidebar">
          <div className="article-hero-sidebar-title">Written by</div>
          
          {authors && authors.map((author, index) => (
            <div key={index} className="article-author">
              <div className="article-author-name">{author.name}</div>
              <div className="article-author-title">{author.title}</div>
              {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noreferrer" className="article-author-social">
                  in
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ArticleHero;
