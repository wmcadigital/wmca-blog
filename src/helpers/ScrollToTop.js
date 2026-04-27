import { useEffect } from "react";
import { useRouter } from "next/router";

const ScrollToTop = () => {
  const router = useRouter();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.asPath]);
};

export default ScrollToTop;
