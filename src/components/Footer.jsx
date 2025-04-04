
function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="relative bg-gradient-to-r  bg-slate-800 dark:from-black dark:to-gray-900  text-slate-300 dark:text-slate-300 text-center pt-36 pb-8">
        <p className="font-bold mb-4 text-4xl">Bereket Melese</p>
        
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-full h-[150px]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C150,100 300,0 450,40 C600,80 750,20 900,40 C1050,60 1200,10 1200,10 L1200,0 L0,0 Z"
              className="fill-current text-gray-50 dark:text-slate-800"
            />
          </svg>
        </div>
        <div className="flex justify-center">
        </div>
        <p className="mt-4 font-bold"> All rights reserved. © 2024 Bereket Melese.</p>
      </footer>
    </>
  );
}

export default Footer;
