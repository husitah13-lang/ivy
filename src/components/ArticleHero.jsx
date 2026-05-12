import React from 'react';
import './ArticleHero.css';
import { EditableText } from './Admin/Editable';

const ArticleHero = ({ eyebrow, title, subtitle, readTime, date, authors, pathPrefix, writtenByLabel }) => {
  return (
    <section className="article-hero">
      <div className="article-hero-container">
        
        <div className="article-hero-content">
          <EditableText path={pathPrefix ? `${pathPrefix}.eyebrow` : 'eyebrow'} component="div" className="article-hero-eyebrow" placeholder="Enter Category...">
            {eyebrow}
          </EditableText>
          <EditableText path={pathPrefix ? `${pathPrefix}.title` : 'title'} component="h1" className="article-hero-title" placeholder="Enter Article Title...">
            {title}
          </EditableText>
          <EditableText path={pathPrefix ? `${pathPrefix}.subtitle` : 'subtitle'} component="h2" className="article-hero-subtitle" placeholder="Enter Short Summary...">
            {subtitle}
          </EditableText>
          
          <div className="article-hero-meta">
            <span>{readTime}</span>
            <span>{date}</span>
          </div>
          
          <div className="article-hero-gradient-line"></div>
        </div>

        <div className="article-hero-sidebar">
          <EditableText path={pathPrefix ? `${pathPrefix}.writtenByLabel` : 'writtenByLabel'} component="div" className="article-hero-sidebar-title" placeholder="Written by">
            {writtenByLabel || "Written by"}
          </EditableText>
          
          {authors && authors.map((author, index) => (
            <div key={index} className="article-author">
              <EditableText path={pathPrefix ? `${pathPrefix}.authors.${index}.name` : `authors.${index}.name`} component="div" className="article-author-name" placeholder="Author Name">
                {author.name}
              </EditableText>
              <EditableText path={pathPrefix ? `${pathPrefix}.authors.${index}.title` : `authors.${index}.title`} component="div" className="article-author-title" placeholder="Job Title">
                {author.title}
              </EditableText>
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
