import Link from "next/link";

export default function AboutPage() {
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
            About THE PUBLIC SAMACHAR
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-700">
            THE PUBLIC SAMACHAR एक डिजिटल न्यूज़ प्लेटफॉर्म है, जिसका उद्देश्य
            देश, राज्य और स्थानीय स्तर की महत्वपूर्ण खबरों को सरल, तेज़ और
            विश्वसनीय तरीके से पाठकों तक पहुँचाना है।
          </p>

          <p className="mt-5 leading-8 text-slate-700">
            हम देश-दुनिया, झारखंड, बिहार, राष्ट्रीय समाचार, मनोरंजन, खेल,
            बिजनेस और समाज से जुड़ी महत्वपूर्ण खबरों को अपने पाठकों तक पहुँचाने
            का प्रयास करते हैं।
          </p>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-black">हमारा उद्देश्य</h2>

            <p className="mt-4 text-xl font-bold text-red-600">
              “सच की खबर, सबसे पहले”
            </p>

            <p className="mt-4 leading-8 text-slate-700">
              हमारा उद्देश्य पाठकों तक महत्वपूर्ण समाचार और जानकारी जिम्मेदारी
              एवं पारदर्शिता के साथ पहुँचाना है।
            </p>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-black">हमारा पता</h2>

            <p className="mt-4 leading-8 text-slate-700">
              <strong>THE PUBLIC SAMACHAR</strong>
              <br />
              Katia, Bohradih, Chandil, Jharkhand, India
            </p>
          </div>

          <div className="mt-10 border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-black">Contact Information</h2>

            <div className="mt-4 space-y-3 text-slate-700">
              <p>
                <strong>Mobile:</strong> 9288421161
              </p>
              <p>
                <strong>Mobile:</strong> 8092391194
              </p>
              <p>
                <strong>Email:</strong> thepublicsamachar1@gmail.com
              </p>
            </div>
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