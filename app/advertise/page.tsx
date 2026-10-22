export const metadata = {
  title: "विज्ञापन के लिए संपर्क करें | THE PUBLIC SAMACHAR",
  description: "THE PUBLIC SAMACHAR पर अपने व्यवसाय, दुकान या कोचिंग का विज्ञापन दें।",
};

const phoneNumbers = ["9288421161", "8092391194"];
const email = "thepublicsamachar1@gmail.com";

export default function AdvertisePage() {
  const message =
    "नमस्ते, मैं THE PUBLIC SAMACHAR पर विज्ञापन देना चाहता/चाहती हूँ। कृपया विज्ञापन की जानकारी और शुल्क बताएँ।";

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 text-slate-900 sm:px-6 sm:py-16">
      <section className="rounded-3xl bg-slate-950 px-6 py-10 text-white sm:px-12 sm:py-14">
        <p className="text-sm font-bold text-red-400">THE PUBLIC SAMACHAR</p>
        <h1 className="mt-4 text-3xl font-black sm:text-5xl">
          हमारे यहाँ विज्ञापन दें
        </h1>
        <p className="mt-5 max-w-2xl leading-7 text-slate-200">
          अपने व्यवसाय, दुकान, कोचिंग संस्थान या सेवाओं की जानकारी हमारे
          पाठकों तक पहुँचाएँ। विज्ञापन देने के लिए हमसे संपर्क करें।
        </p>
        <a
          href={`https://wa.me/91${phoneNumbers[0]}?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700"
        >
          WhatsApp पर संपर्क करें
        </a>
      </section>

      <section className="mt-10 grid gap-5 sm:grid-cols-3">
        {[
          {
            title: "बैनर विज्ञापन",
            description: "वेबसाइट पर अपने व्यवसाय का बैनर प्रदर्शित करवाएँ।",
          },
          {
            title: "व्यवसाय का प्रचार",
            description: "अपने उत्पादों या सेवाओं का प्रचार करवाएँ।",
          },
          {
            title: "प्रायोजित सामग्री",
            description: "प्रायोजित लेख या प्रचार सामग्री के लिए संपर्क करें।",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 p-6 shadow-sm"
          >
            <h2 className="text-lg font-extrabold">{item.title}</h2>
            <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 p-6 sm:p-8">
        <h2 className="text-2xl font-black">विज्ञापन के लिए संपर्क करें</h2>
        <p className="mt-3 leading-7 text-slate-600">
          अपनी आवश्यकता बताएँ। विज्ञापन की जगह, शुल्क और उपलब्धता के बारे में
          आपसे बातचीत की जाएगी।
        </p>
        <div className="mt-6 flex flex-col gap-4">
          {phoneNumbers.map((number) => (
            <p key={number}>
              <strong>फोन: </strong>
              <a className="text-blue-700 underline" href={`tel:${number}`}>
                {number}
              </a>
            </p>
          ))}
          <p>
            <strong>ईमेल: </strong>
            <a
              className="break-all text-blue-700 underline"
              href={`mailto:${email}?subject=${encodeURIComponent("विज्ञापन संबंधी पूछताछ - THE PUBLIC SAMACHAR")}`}
            >
              {email}
            </a>
          </p>
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-slate-500">
        सभी विज्ञापन अनुरोधों की समीक्षा और उपलब्धता के आधार पर स्वीकृति दी जाएगी।
      </p>
    </main>
  );
}
