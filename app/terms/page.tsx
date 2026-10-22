import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link href="/" className="text-xl font-black">
            THE PUBLIC SAMACHAR
          </Link>

          <Link
            href="/"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-200"
          >
            Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-10">
          <h1 className="text-3xl font-black sm:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last Updated: 2026
          </p>

          <p className="mt-6 leading-8 text-slate-700">
            THE PUBLIC SAMACHAR वेबसाइट का उपयोग करने से पहले कृपया इन Terms &
            Conditions को पढ़ें। हमारी वेबसाइट का उपयोग करने का अर्थ है कि आप
            इन शर्तों से सहमत हैं।
          </p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-xl font-black">1. वेबसाइट का उपयोग</h2>
              <p className="mt-3 leading-8 text-slate-700">
                THE PUBLIC SAMACHAR पर उपलब्ध समाचार और अन्य सामग्री सामान्य
                जानकारी एवं समाचार उद्देश्यों के लिए प्रकाशित की जाती है।
              </p>
              <p className="mt-3 leading-8 text-slate-700">
                वेबसाइट का उपयोग किसी गैर-कानूनी या ऐसी गतिविधि के लिए नहीं
                किया जाना चाहिए जिससे वेबसाइट, उसके users या किसी अन्य व्यक्ति
                को नुकसान पहुँचे।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">2. News Content</h2>
              <p className="mt-3 leading-8 text-slate-700">
                हम अपने पाठकों तक समाचार और जानकारी पहुँचाने का प्रयास करते
                हैं। समाचारों में उपलब्ध जानकारी समय के साथ बदल सकती है।
              </p>
              <p className="mt-3 leading-8 text-slate-700">
                पाठकों को महत्वपूर्ण मामलों में स्वतंत्र रूप से जानकारी की
                पुष्टि करने की सलाह दी जाती है।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">3. Copyright</h2>
              <p className="mt-3 leading-8 text-slate-700">
                THE PUBLIC SAMACHAR वेबसाइट पर उपलब्ध original text, graphics,
                logo, design और अन्य original सामग्री पर लागू अधिकार THE PUBLIC
                SAMACHAR या संबंधित अधिकारधारक के पास हो सकते हैं।
              </p>
              <p className="mt-3 leading-8 text-slate-700">
                बिना अनुमति किसी original सामग्री को कॉपी, पुनः प्रकाशित या
                व्यावसायिक रूप से इस्तेमाल नहीं किया जाना चाहिए।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">4. User Responsibility</h2>
              <p className="mt-3 leading-8 text-slate-700">
                वेबसाइट का उपयोग करते समय users को लागू कानूनों और नियमों का
                पालन करना होगा।
              </p>
              <p className="mt-3 leading-8 text-slate-700">
                किसी भी व्यक्ति या संस्था के विरुद्ध गलत, अपमानजनक या गैर-कानूनी
                सामग्री का उपयोग नहीं किया जाना चाहिए।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">5. External Links</h2>
              <p className="mt-3 leading-8 text-slate-700">
                हमारी वेबसाइट पर अन्य websites और social media platforms के
                links हो सकते हैं। इन external websites की सामग्री और policies
                के लिए संबंधित website जिम्मेदार होगी।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">6. Website Availability</h2>
              <p className="mt-3 leading-8 text-slate-700">
                हम वेबसाइट को सुचारु रूप से उपलब्ध रखने का प्रयास करते हैं,
                लेकिन technical problems, maintenance या अन्य परिस्थितियों के
                कारण वेबसाइट कुछ समय के लिए unavailable हो सकती है।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">7. Terms में बदलाव</h2>
              <p className="mt-3 leading-8 text-slate-700">
                THE PUBLIC SAMACHAR आवश्यकता के अनुसार इन Terms & Conditions को
                समय-समय पर अपडेट कर सकता है। बदलाव इसी page पर प्रकाशित किए
                जाएंगे।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">8. Contact</h2>
              <p className="mt-3 leading-8 text-slate-700">
                <strong>THE PUBLIC SAMACHAR</strong>
                <br />
                Katia, Bohradih, Chandil, Jharkhand, India
                <br />
                <br />
                <strong>Mobile:</strong> 9288421161
                <br />
                <strong>Mobile:</strong> 8092391194
                <br />
                <strong>Email:</strong> thepublicsamachar1@gmail.com
              </p>
            </section>
          </div>

          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
            >
              ← वापस Home पर जाएँ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}