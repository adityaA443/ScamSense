export default function Footer() {
  return (
    <footer className="border-t border-[#222] py-10 mt-24">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[#48484a] text-[13px]">© 2025 ScamSense. Not a substitute for professional advice.</p>
        <p className="text-[#48484a] text-[13px]">
          Report fraud to{' '}
          <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className="text-[#86868b] hover:text-white transition-colors">FTC</a>
          {' · '}
          <a href="https://www.ic3.gov" target="_blank" rel="noopener noreferrer" className="text-[#86868b] hover:text-white transition-colors">FBI IC3</a>
        </p>
      </div>
    </footer>
  );
}
