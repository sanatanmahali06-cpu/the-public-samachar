import Link from "next/link";

export const metadata = {
  title: "Disclaimer | THE PUBLIC SAMACHAR",
  description:
    "THE PUBLIC SAMACHAR की समाचार सामग्री, स्रोतों और सुधार संबंधी अस्वीकरण।",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <article className="mx-auto max-w-4xl rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-10">
        <h1 className="text-3xl font-black sm:text-4xl">Disclaimer / अस्वीकरण</h1>
        <p className="mt-3 text-sm text-slate-500">Last Updated: October 2026</p>

        <p className="mt-6 leading-8">
          THE PUBLIC SAMACHAR पर प्रकाशित समाचार और लेख सामान्य सूचना एवं जनहित
          के उद्देश्य से प्रस्तुत किए जाते हैं। हम जानकारी को सही और समयानुकूल
          रखने का प्रयास करते हैं, लेकिन हर परिस्थिति में पूर्णता या त्रुटिरहित
          होने की गारंटी नहीं देते।
        </p>

        <h2 className="mt-8 text-xl font-bold">समाचार और तथ्य-जाँच</h2>
        <p className="mt-3 leading-8">
          समाचार उपलब्ध आधिकारिक बयानों, दस्तावेजों और अन्य स्रोतों पर आधारित
          हो सकते हैं। जहाँ स्वतंत्र पुष्टि उपलब्ध न हो, वहाँ उस सीमा को स्पष्ट
          किया जाना चाहिए। नई जानकारी मिलने पर समाचार अपडेट हो सकते हैं।
        </p>

        <h2 className="mt-8 text-xl font-bold">बाहरी स्रोत</h2>
        <p className="mt-3 leading-8">
          बाहरी वेबसाइटों के लिंक संदर्भ और पाठकों की सुविधा के लिए दिए जा सकते
          हैं। उन वेबसाइटों की सामग्री और नीतियों पर हमारा नियंत्रण नहीं है।
        </p>

        <h2 className="mt-8 text-xl font-bold">त्रुटि या सुधार</h2>
        <p className="mt-3 leading-8">
          किसी समाचार में तथ्यात्मक गलती दिखाई देने पर कृपया Contact पेज से
          सूचना दें। हम उपलब्ध प्रमाणों की समीक्षा करके आवश्यक सुधार करने का
          प्रयास करेंगे।
        </p>

        <h2 className="mt-8 text-xl font-bold">संपर्क</h2>
        <p className="mt-3 leading-8">
          THE PUBLIC SAMACHAR, Katia, Bohradih, Chandil, Jharkhand, India
          <br />
          Email: thepublicsamachar1@gmail.com
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700">
            Contact Us
          </Link>
          <Link href="/" className="rounded-lg bg-slate-200 px-5 py-3 font-bold text-slate-900 hover:bg-slate-300">
            ← Home पर जाएँ
          </Link>
        </div>
      </article>
    </main>
  );
}