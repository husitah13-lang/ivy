import React from 'react';
import './ArticleTextSection.css';
import { EditableText } from './Admin/Editable';

const ArticleTextSection = ({ title, paragraphs, pathPrefix }) => {
  if (!title && (!paragraphs || paragraphs.length === 0)) return null;

  return (
    <section className="article-text-section">
      <div className="article-text-container">
        {title && (
          <EditableText path={pathPrefix ? `${pathPrefix}.title` : 'title'} component="h2" className="article-text-title">
            {title}
          </EditableText>
        )}
        {paragraphs && (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).map((para, index) => (
          <EditableText key={index} path={pathPrefix ? `${pathPrefix}.paragraphs.${index}` : `paragraphs.${index}`} component="p" className="article-text-paragraph">
            {para}
          </EditableText>
        ))}
      </div>
    </section>
  );
};

export default ArticleTextSection;
