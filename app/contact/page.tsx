export const metadata = {
  title: "Contact Us | THE PUBLIC SAMACHAR",
  description: "THE PUBLIC SAMACHAR से संपर्क करें।",
};

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-5 py-10 text-slate-900">
      <a href="/" className="text-blue-700 underline">← THE PUBLIC SAMACHAR Home</a>

      <h1 className="mt-8 text-3xl font-bold">Contact Us</h1>
      <p className="mt-4 leading-8">
        THE PUBLIC SAMACHAR से समाचार, सुझाव, सुधार या अन्य प्रश्नों के लिए संपर्क करें।
      </p>

      <h2 className="mt-8 text-xl font-bold">THE PUBLIC SAMACHAR</h2>
      <p className="mt-3 leading-7">
        Katia, Bohradih, Chandil, Jharkhand, India
      </p>

      <p className="mt-4">
        Mobile: <a className="text-blue-700 underline" href="tel:9288421161">9288421161</a>
      </p>
      <p className="mt-2">
        Mobile: <a className="text-blue-700 underline" href="tel:8092391194">8092391194</a>
      </p>
      <p className="mt-2">
        Email: <a className="text-blue-700 underline" href="mailto:thepublicsamachar1@gmail.com">thepublicsamachar1@gmail.com</a>
      </p>
    </main>
  );
}