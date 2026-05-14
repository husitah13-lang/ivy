import React, { useState, useEffect } from 'react';
import './Contact.css';
import { useTranslation } from 'react-i18next';
import { fetchAPI } from '../utils/api';
import { useVisualEditor } from '../context/VisualEditorContext';
import { EditableText } from '../components/Admin/Editable';
import { Link } from 'react-router-dom';

const Contact = () => {
  const { t, i18n } = useTranslation();
  const { isCMS, draftData, initDraft } = useVisualEditor();
  const [cmsData, setCmsData] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    inquiryType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    country: '',
    message: '',
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const collection = i18n.language === 'ar' ? 'contact.ar' : 'contact';
        const data = await fetchAPI(`/content/${collection}`);
        if (data) {
          setCmsData(data);
          if (isCMS) initDraft(data, collection);
        } else {
          // fallback import
          const fallbackModule = i18n.language === 'ar' ? await import('../data/content/contact.ar.js') : await import('../data/content/contact.js');
          const fallbackData = i18n.language === 'ar' ? fallbackModule.contactContentAr : fallbackModule.contactContent;
          setCmsData(fallbackData);
          if (isCMS) initDraft(fallbackData, collection);
        }
      } catch (err) {
        console.warn("CMS contact fetch failed", err);
      }
    };
    loadData();
  }, [isCMS, i18n.language]);

  const activeData = (isCMS && draftData) ? draftData : cmsData;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please agree to the privacy statement to continue.");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/contact-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          destinationEmail: activeData?.destination_email || "zahra.tahir@ivyinteractive.co"
        })
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          inquiryType: '', firstName: '', lastName: '', email: '',
          phone: '', company: '', role: '', country: '', message: '', consent: false
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activeData) return <div className="contact-page"></div>;

  return (
    <div className="contact-page" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Hero / Grid Section */}
      <section className="contact-help-section">
        <div className="contact-container">
          <EditableText path="hero.title" component="h1" className="help-title">
            {activeData.hero?.title}
          </EditableText>
          
          <div className="help-grid">
            {activeData.gridOptions?.map((item, index) => (
              <div className="help-card" key={index}>
                <div className="help-icon">
                  <div className="icon-placeholder"></div>
                </div>
                <EditableText path={`gridOptions.${index}.title`} component="h3" className="help-card-title">
                  {item.title}
                </EditableText>
                <EditableText path={`gridOptions.${index}.text`} component="p" className="help-card-text">
                  {item.text}
                </EditableText>
                <div className="help-card-link">
                  <EditableText path={`gridOptions.${index}.linkText`} component="span">
                    {item.linkText}
                  </EditableText>
                  <span className="arrow">›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="contact-form-section">
        <div className="form-container">
          <EditableText path="form.title" component="h2" className="form-title">
            {activeData.form?.title}
          </EditableText>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label><EditableText path="form.fields.inquiryType" component="span">{activeData.form?.fields?.inquiryType}</EditableText></label>
              <select name="inquiryType" value={formData.inquiryType} onChange={handleChange} required>
                <option value="" disabled>{activeData.form?.fields?.selectValuePlaceholder || "Select a value"}</option>
                <option value="General">General Inquiry</option>
                <option value="Sales">Sales</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <EditableText path="form.aboutYouTitle" component="h3" className="about-you-title">
              {activeData.form?.aboutYouTitle}
            </EditableText>

            <div className="form-group">
              <label><EditableText path="form.fields.firstName" component="span">{activeData.form?.fields?.firstName}</EditableText></label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label><EditableText path="form.fields.lastName" component="span">{activeData.form?.fields?.lastName}</EditableText></label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label><EditableText path="form.fields.email" component="span">{activeData.form?.fields?.email}</EditableText></label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label><EditableText path="form.fields.phone" component="span">{activeData.form?.fields?.phone}</EditableText></label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label><EditableText path="form.fields.company" component="span">{activeData.form?.fields?.company}</EditableText></label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label><EditableText path="form.fields.role" component="span">{activeData.form?.fields?.role}</EditableText></label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label><EditableText path="form.fields.country" component="span">{activeData.form?.fields?.country}</EditableText></label>
              <select name="country" value={formData.country} onChange={handleChange} required>
                <option value="" disabled>{activeData.form?.fields?.selectValuePlaceholder || "Select a value"}</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="AE">United Arab Emirates</option>
                <option value="PK">Pakistan</option>
              </select>
            </div>

            <div className="form-group">
              <label><EditableText path="form.fields.message" component="span">{activeData.form?.fields?.message}</EditableText></label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows="5" maxLength="5000" required></textarea>
              <div className="char-count">5000</div>
            </div>

            <div className="form-consent">
              <label className="checkbox-container">
                <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} />
                <span className="checkmark"></span>
                <span className="consent-text">
                  <EditableText path="form.consentText" component="span">{activeData.form?.consentText}</EditableText>
                  <Link to="/privacy" className="privacy-link"><EditableText path="form.privacyLinkText" component="span">{activeData.form?.privacyLinkText}</EditableText></Link>
                </span>
              </label>
            </div>

            {submitStatus === 'success' && <div className="submit-success">Your message has been sent successfully!</div>}
            {submitStatus === 'error' && <div className="submit-error">There was an error sending your message. Please try again.</div>}

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              <EditableText path="form.submitButton" component="span">{activeData.form?.submitButton}</EditableText>
            </button>
          </form>
        </div>
      </section>

      {/* Footer Contact Section */}
      <section className="contact-footer-section">
        <div className="form-container">
          <EditableText path="footerOptions.title" component="h2" className="contact-footer-title">
            {activeData.footerOptions?.title}
          </EditableText>
          
          <div className="contact-footer-grid">
            <div className="contact-footer-col">
              <div className="purple-divider"></div>
              <EditableText path="footerOptions.callUs.title" component="h3">{activeData.footerOptions?.callUs?.title}</EditableText>
              <EditableText path="footerOptions.callUs.text" component="p" style={{ whiteSpace: 'pre-line' }}>
                {activeData.footerOptions?.callUs?.text}
              </EditableText>
            </div>
            
            <div className="contact-footer-col">
              <div className="purple-divider"></div>
              <EditableText path="footerOptions.visitUs.title" component="h3">{activeData.footerOptions?.visitUs?.title}</EditableText>
              <EditableText path="footerOptions.visitUs.text" component="p">
                {activeData.footerOptions?.visitUs?.text}
              </EditableText>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
