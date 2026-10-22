import Link from "next/link";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last Updated: 2026
          </p>

          <p className="mt-6 leading-8 text-slate-700">
            THE PUBLIC SAMACHAR (“हम”, “हमारी वेबसाइट”) अपने visitors की
            privacy का सम्मान करता है। यह Privacy Policy बताती है कि हमारी
            वेबसाइट का उपयोग करते समय आपकी जानकारी के संबंध में हमारी सामान्य
            practices क्या हैं।
          </p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-xl font-black">1. जानकारी का उपयोग</h2>
              <p className="mt-3 leading-8 text-slate-700">
                हमारी वेबसाइट पर सामान्य रूप से समाचार पढ़ने के लिए किसी
                व्यक्तिगत जानकारी की आवश्यकता नहीं होती। यदि आप स्वयं कोई
                जानकारी जैसे नाम, ईमेल या अन्य details किसी form के माध्यम से
                देते हैं, तो उसका उपयोग संबंधित उद्देश्य के लिए किया जा सकता है।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">2. Cookies</h2>
              <p className="mt-3 leading-8 text-slate-700">
                THE PUBLIC SAMACHAR वेबसाइट बेहतर user experience और वेबसाइट
                के प्रदर्शन को समझने के लिए cookies या इसी प्रकार की
                technologies का उपयोग कर सकती है।
              </p>
              <p className="mt-3 leading-8 text-slate-700">
                भविष्य में यदि Google AdSense या अन्य advertising services का
                उपयोग किया जाता है, तो वे अपनी policies के अनुसार cookies और
                similar technologies का उपयोग कर सकती हैं।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">3. Third-Party Services</h2>
              <p className="mt-3 leading-8 text-slate-700">
                हमारी वेबसाइट पर भविष्य में third-party services, जैसे
                analytics, advertising या social media services के links/features
                हो सकते हैं। इन services की अपनी privacy policies हो सकती हैं।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">4. External Links</h2>
              <p className="mt-3 leading-8 text-slate-700">
                हमारी वेबसाइट पर अन्य websites और social media platforms के
                links हो सकते हैं। उन websites की privacy practices के लिए
                संबंधित website की अपनी Privacy Policy लागू होगी।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">5. बच्चों की Privacy</h2>
              <p className="mt-3 leading-8 text-slate-700">
                हम जानबूझकर बच्चों से व्यक्तिगत जानकारी एकत्र करने का प्रयास
                नहीं करते।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">
                6. Privacy Policy में बदलाव
              </h2>
              <p className="mt-3 leading-8 text-slate-700">
                THE PUBLIC SAMACHAR आवश्यकता के अनुसार इस Privacy Policy को
                समय-समय पर अपडेट कर सकता है। किसी भी बदलाव के बाद updated
                policy इसी page पर उपलब्ध होगी।
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black">7. Contact</h2>
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