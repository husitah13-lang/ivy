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

const cookieContent = {
  header: "SUPPORT",
  title: "Cookies and similar technology",
  body: `Below is information about how Accenture PLC and its affiliates ("we") use cookies and other similar technology on this website.\n\nThis policy is effective as of November 3, 2025. Please note that this privacy statement will be updated from time to time.\n\nWe can place cookies and other similar technology on your device, including mobile device, in accordance with your preferences set on our cookie consent manager. Depending on your settings in our cookie consent manager on your mobile device, the following information may be collected through cookies or similar technology: your unique device identifier, mobile device IP address, information about your device's operating system, mobile carrier and your location information (to the extent permissible under applicable law).\n\n<h2>What are cookies?</h2>\n\nCookies are text files containing small amounts of information which are downloaded to your computer or mobile device when you visit a site and allow a site to recognize your device. Cookies managed by Accenture only are called "first party cookies" whereas cookies from third parties are called "third party cookies" as explained below.`,
  seo: { title: "Cookie Policy | IVY Interactive", description: "Information about how we use cookies." }
};

const cookieContentAr = {
  header: "الدعم",
  title: "ملفات تعريف الارتباط والتقنيات المشابهة",
  body: `فيما يلي معلومات حول كيفية استخدام Accenture PLC والشركات التابعة لها ("نحن") لملفات تعريف الارتباط والتقنيات المشابهة الأخرى على هذا الموقع.\n\nهذه السياسة سارية اعتبارًا من 3 نوفمبر 2025. يرجى ملاحظة أن بيان الخصوصية هذا سيتم تحديثه من وقت لآخر.\n\nيمكننا وضع ملفات تعريف الارتباط والتقنيات المشابهة الأخرى على جهازك، بما في ذلك الأجهزة المحمولة، وفقًا لتفضيلاتك المحددة في مدير الموافقة على ملفات تعريف الارتباط الخاص بنا. اعتمادًا على إعداداتك في مدير الموافقة على ملفات تعريف الارتباط على جهازك المحمول، قد يتم جمع المعلومات التالية من خلال ملفات تعريف الارتباط أو التكنولوجيا المشابهة: معرف الجهاز الفريد الخاص بك، عنوان IP للجهاز المحمول، معلومات حول نظام تشغيل جهازك، شركة الجوال ومعلومات موقعك (إلى الحد المسموح به بموجب القانون المعمول به).\n\n<h2>ما هي ملفات تعريف الارتباط؟</h2>\n\nملفات تعريف الارتباط هي ملفات نصية تحتوي على كميات صغيرة من المعلومات التي يتم تنزيلها على جهاز الكمبيوتر أو الجهاز المحمول الخاص بك عندما تزور موقعًا وتسمح للموقع بالتعرف على جهازك. تُسمى ملفات تعريف الارتباط التي تديرها أكسنتشر فقط "ملفات تعريف ارتباط الطرف الأول" في حين تُسمى ملفات تعريف الارتباط من أطراف ثالثة "ملفات تعريف ارتباط الطرف الثالث" كما هو موضح أدناه.`,
  seo: { title: "سياسة ملفات تعريف الارتباط | آيفي إنترأكتيف", description: "معلومات حول كيفية استخدامنا لملفات تعريف الارتباط." }
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
    await syncCollection('cookie', cookieContent);
    
    await syncCollection('privacy.ar', privacyContentAr);
    await syncCollection('terms.ar', termsContentAr);
    await syncCollection('accessibility.ar', accessibilityContentAr);
    await syncCollection('cookie.ar', cookieContentAr);

    console.log('Legal Sync Complete!');
    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
