require('dotenv').config();
const mongoose = require('mongoose');
const Content = require('./models/Content');

const privacyContent = {
  header: "SUPPORT",
  title: "Accenture privacy statement",
  body: `This privacy statement is effective as of January 7, 2026. Please note that this privacy statement will regularly be updated to reflect any changes in the way we handle your personal data or any changes in applicable laws.\n\nUnless stated otherwise, this privacy statement applies to all of Accenture's externally facing applications, services, games, tools, websites and other data processing activities where Accenture is acting as a data controller (or any local equivalent).\n\nThe purpose of this privacy statement is to provide you with a comprehensive description of Accenture's practices concerning the processing of personal information.`,
  seo: { title: "Privacy Statement | IVY Interactive", description: "Our Privacy Statement outlines how we handle your personal data." }
};

const termsContent = {
  header: "SUPPORT",
  title: "Accenture terms of use",
  body: `By accessing and using this site, you accept the following terms and conditions, without limitation or qualification.\n\nUnless otherwise stated, the contents of this site including, but not limited to, the text and images contained herein and their arrangement are the property of Accenture. All trademarks used or referred to in this website are the property of their respective owners.\n\nNothing contained in this site shall be construed as conferring by implication, estoppel, or otherwise, any license or right to any copyright, patent, trademark or other proprietary interest of Accenture or any third party.`,
  seo: { title: "Terms of Use | IVY Interactive", description: "Terms and conditions for using our website." }
};

const accessibilityContent = {
  header: "SUPPORT",
  title: "Accenture accessibility statement",
  body: `Accenture believes that enterprises have a powerful role to play in ensuring technology helps bridge the divide for people with disabilities. Providing increased access to technologies that meet the needs of persons with disabilities lays the foundation for inclusive work cultures that enable all employees to thrive.\n\nTo support this belief, we strive to make accenture.com as accessible as possible to all people. As our guide across the site we use the World Wide Web Consortium's Web Content Accessibility Guidelines (WCAG) 2.1.`,
  seo: { title: "Accessibility Statement | IVY Interactive", description: "Our commitment to accessibility." }
};

const privacyContentAr = {
  header: "الدعم",
  title: "بيان الخصوصية لشركة أكسنتشر",
  body: `يسري بيان الخصوصية هذا اعتبارًا من 7 يناير 2026. يرجى ملاحظة أن بيان الخصوصية هذا سيتم تحديثه بانتظام ليعكس أي تغييرات في طريقة تعاملنا مع بياناتك الشخصية أو أي تغييرات في القوانين المعمول بها.\n\nما لم يُنص على خلاف ذلك، ينطبق بيان الخصوصية هذا على جميع التطبيقات والخدمات والألعاب والأدوات ومواقع الويب وغيرها من أنشطة معالجة البيانات التي تواجه الجمهور خارجيًا حيث تعمل أكسنتشر كمراقب للبيانات (أو أي معادل محلي).\n\nالغرض من بيان الخصوصية هذا هو تزويدك بوصف شامل لممارسات أكسنتشر المتعلقة بمعالجة المعلومات الشخصية.`,
  seo: { title: "بيان الخصوصية | آيفي إنترأكتيف", description: "يوضح بيان الخصوصية الخاص بنا كيفية تعاملنا مع بياناتك الشخصية." }
};

const termsContentAr = {
  header: "الدعم",
  title: "شروط الاستخدام لشركة أكسنتشر",
  body: `من خلال الوصول إلى هذا الموقع واستخدامه، فإنك تقبل الشروط والأحكام التالية، دون قيد أو شرط.\n\nما لم يُنص على خلاف ذلك، فإن محتويات هذا الموقع بما في ذلك، على سبيل المثال لا الحصر، النصوص والصور الواردة هنا وترتيبها هي ملك لأكسنتشر. جميع العلامات التجارية المستخدمة أو المشار إليها في هذا الموقع هي ملك لأصحابها المعنيين.\n\nلا يجوز تفسير أي شيء وارد في هذا الموقع على أنه يمنح ضمنيًا أو بالمنع أو غير ذلك، أي ترخيص أو حق في أي حقوق طبع ونشر أو براءة اختراع أو علامة تجارية أو أي مصلحة ملكية أخرى لأكسنتشر أو أي طرف ثالث.`,
  seo: { title: "شروط الاستخدام | آيفي إنترأكتيف", description: "الشروط والأحكام لاستخدام موقعنا." }
};

const accessibilityContentAr = {
  header: "الدعم",
  title: "بيان إمكانية الوصول لشركة أكسنتشر",
  body: `تؤمن أكسنتشر بأن للشركات دورًا قويًا تلعبه في ضمان مساعدة التكنولوجيا في سد الفجوة للأشخاص ذوي الإعاقة. إن توفير وصول متزايد إلى التقنيات التي تلبي احتياجات الأشخاص ذوي الإعاقة يضع الأساس لثقافات عمل شاملة تمكن جميع الموظفين من الازدهار.\n\nلدعم هذا الاعتقاد، نسعى جاهدين لجعل موقعنا متاحًا قدر الإمكان لجميع الأشخاص. كدليل لنا عبر الموقع، نستخدم إرشادات إمكانية الوصول إلى محتوى الويب (WCAG) 2.1 الخاصة باتحاد شبكة الويب العالمية.`,
  seo: { title: "بيان إمكانية الوصول | آيفي إنترأكتيف", description: "التزامنا بإمكانية الوصول." }
};

async function syncCollection(name, data) {
    console.log(`Syncing collection: ${name}...`);
    await Content.findOneAndUpdate(
        { name: name },
        { name: name, data: data, lastUpdated: new Date() },
        { upsert: true }
    );
    console.log(`Synced ${name}`);
}

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await syncCollection('privacy', privacyContent);
    await syncCollection('terms', termsContent);
    await syncCollection('accessibility', accessibilityContent);
    
    await syncCollection('privacy.ar', privacyContentAr);
    await syncCollection('terms.ar', termsContentAr);
    await syncCollection('accessibility.ar', accessibilityContentAr);

    console.log('Legal Sync Complete!');
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
