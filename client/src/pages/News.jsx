import React, { useRef } from "react";
import Navbar from "../components/Navbar";

// 1️⃣ ————————————————————————————————————————————
//  DUMMY DATA – in a real app this could come from your API / CMS
//    • featuredNews → will feed the top carousel
//    • latestNews   → will render the vertical list underneath
//  Each item already contains everything the view needs (img, title, text, url)
// ————————————————————————————————————————————————
const featuredNews = [
  {
    id: 1,
    title: "Latest Game Update",
    description: "Explore the newest features and improvements in our latest game update.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVXSX9MgHLszefJqt8DOCHp4aR468NOY12OokHAmpbGa6krssKjthXUVMxLgrsQr-qGHn59rMnWcJLQLEi6SGsGd7SYN43IzTX5oBWsgR3ELCe5b1jO6M7E13yVw4F91SIUgxZhIEvonRdpSnxkaQv2RLRr2_kZi2eJ_TTWyn-03rpDu233h6jftH53YSIEan2FqQhdu4KjGhrLal4QIHPH7ADAn2YonVvv-GgZK1MQ7QFcjpyKqRs4_qPVCYgc5gczCk1XTWn-vl9",
    url: "/news/latest-game-update",
  },
  {
    id: 2,
    title: "New Game Release",
    description: "Discover the latest game release with exciting new gameplay and stunning visuals.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTuCa3nGpP7Q6vyp-JgVrKzOnezjvNbaMeRVMeomFkPz7yCPHakB38OwFAYzywv-AwhzydFndGkooqJvbW8_RnCPrdzrAT1ZtecRmmxyxx6TTObTOF4b1ufxmd3KgU657e4Z0L6YiBiGz95GIJDcm6VzR9UElj08BhN5e4KEzQtjUTWavqTTkpXN-do57JSNK8jEPwWMpNzJ7jXmTUAse8YlRNbKfkK2Ti0FARpPFvlOYQVCG7u6LVSHAWh-olusO0znnppqgVet4t",
    url: "/news/new-game-release",
  },
  {
    id: 3,
    title: "Community Event",
    description: "Join our community event for exclusive rewards and challenges.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF88uUg8MkfjMmr7ZEt_0-2tZkNh2MrKwXthSFUJyxIQF_VMkkgOQRAnVBLjElL8oxiDLNMKC4VaBRddy0kS9bd5LhuZR7OLl8FZmF_6mdbwR3a7OGvrFNdDaTQ2Er25Hoh364zkJZxDXv7YJUsPGQw2b_wF4cTvzHymoiyAzG3-D6qm10aOE6N4S04eZ2Sdbf5_cXRUJvJp9ku3Sk8WEaIBYwXWme8HMzY5o86YRKUKz-92mOI3hDMP6xaFW_x5AYZYb_EZX6g-tB",
    url: "/news/community-event",
  },
  {
    id: 4,
    title: "Game Anniversary",
    description: "Celebrate the anniversary of our popular game with special in‑game events.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCi9m5Z4xO9VSNYDnxtCWeXAbTfT2XmZeCplzTwxop13-W33DSMk_EpC4lbs5DZ9n6l78I2aIJno8xQCbsD9TzAxoICTPBlunNIzD4rEgwYYF9bj7BFsNfMzKq24IW0M4eGrZLnCcufbquosAIC-UX6UTKsjMd3BP99cSUhrBETe4201RJfUvIxnyPxPUoyAO2_jqmr4qB7xFBB2NHawdGLmmds_MwEYOzzsi8IPA7PccsOQcuIVHyRfk2PPqPtaUyA18YSs7u2NLCk",
    url: "/news/game-anniversary",
  },
  {
    id: 5,
    title: "Special Offer",
    description: "Take advantage of our limited‑time special offer on select game titles.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU_sACfucqOmLulvZS4aR8s3ksDJoo4d0JPoR54FeyE3Ym6U7Xj2VdamxUtxIrLxSnfKQYVlojfbte7LqRRjaTzrzYzU_BUTz_xosG5xFatDpMvoSvY5Fubi8G7KJP4HKAG0EXoVEJGRW0BIIJ_x2yRPOOVZzYoepFA7afAO5dJ1FRm6WYML9dA_btXsaEsevJ2056Y2fG6VnvMNVbgOXusIoEyc_2qaJOr7d4QQLXt8peovDFHJBAIiD3igbAZsvohZecJH3Qd3Y8",
    url: "/news/special-offer",
  },
];

const latestNews = [
  {
    id: 101,
    category: "Game Update",
    title: "New Update for 'Cosmic Conquest' Released",
    description:
      "Version 2.0 of 'Cosmic Conquest' is now live, featuring new maps, units, and gameplay enhancements. Dive into the updated universe and conquer new challenges.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOqpMNsdCyBD9B49sfrrRa96PpnbXUZVIlxkK7AIB5CR19F-kLJIEtmxf86hKTgCvLivVOk_Z15glcAOKWKCEwnKSieO7zJFasBP-oPESYcV-QHcy76ijMdD8dj7Wl980oIJhRBOy7O4armSoOKylpyQ7IyiORb8RRFIY4Chkr8MiFmuOlTMf7RGGM2G88kyZxX93bqpv4p6wHdRguDrWu3y5ExUwW6sSOkxF0I74tt9NEB3EMJoAUBQYPTGz0_rPnGnOBhOh4IE-I",
    url: "/news/cosmic-conquest-update",
  },
  {
    id: 102,
    category: "Game Release",
    title: "Introducing 'Mystic Realms': A New RPG Adventure",
    description:
      "Embark on an epic journey in 'Mystic Realms', a new RPG adventure filled with magic, mystery, and mythical creatures. Explore vast landscapes and uncover ancient secrets.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuADBeOznebh8j7SrDJ61w41M31T8-LbOH2_7go6cSAholI5oUg5Igfmxsh3omiK3p_3tYnYO7Uj_SI0LdDp9XoXiCgUFtLYQCkpUfYut9Jz_rEHPnaU0raa5Fixcsr3BUKTNwGeMtAF9fzHJHq7XzGcnou7kXvvdls2oc6R_Czlbx8XHIkYH8bw4xHa-xE7NS5ogfiGsf2EXf8XgsePxgddPswnQDHS-l1KmHC8WTlruaWF09u5e9aPo3MV9Hb0RYwmnG0VQ9sDi1ou",
    url: "/news/mystic-realms-release",
  },
  {
    id: 103,
    category: "Community Event",
    title: "Join the 'Galactic Clash' Tournament",
    description:
      "Compete in the 'Galactic Clash' tournament for a chance to win exclusive in‑game rewards and recognition. Sign up now and show your skills in this thrilling event.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7Ouj_bI8lpUKCHJBcm_qL_arjKUKnR0HQu8VIJ60QmnGYBava21Kn2F3fln-lYyfz4lMrCkLBqXYURw2yHkCEaeZ2QyYNwnoT2k0y8d96jnfWuO4XlVZSdsY4iBheAd057HXIPIBzFeyAMuM1xBdibZRHBgca4o_TI7LcUCT-4tHdV9yNJxQQsnHm7z25wWyFhJtamF5kk5JM2-hmNm0FKSQtPAygiXizQIGiSJjD7Zolew92wE-P_tUqn7luLu-dmoAQc-sHq3JF",
    url: "/news/galactic-clash-tournament",
  },
  {
    id: 104,
    category: "Developer Update",
    title: "Behind the Scenes: Development of 'Cyberpunk City'",
    description:
      "Get an exclusive look at the development process of 'Cyberpunk City'. Our team shares insights on the creation of this immersive world and its unique features.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaT7EPEEHkbFpGfwo6nS2-lyR2rMPQv9Orin0Y5CGvUkiaMUXE6ZBh6NSpW4EKXDq2n1iCTwiEMMLnJEhP_b-XzOkj8ccsgEjQBk6Qk2UmxEtD3OWA4GSMzSZx9BRVBYdxyNRvdAxscg1vfVjTZ8EvYP6EotNEaLadPXDL7wsZ0tcU9ozYAzb37Av5fivWlz7WRwCEiBu2onnLS9Ds9LROFkHQgY1PY-1AHvnLDVU8jjPwyIT_EoVLT2O-VLauXavSL2937v9UgEMW",
    url: "/news/cyberpunk-city-devlog",
  },
  {
    id: 105,
    category: "Game Review",
    title: "'Shadows of the Past' Receives Critical Acclaim",
    description:
      "'Shadows of the Past' has been praised by critics for its compelling storyline, engaging gameplay, and stunning visuals. Read the full review to learn more about this highly‑rated title.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuClSpgXigTTOrp7tjOOGsDjqjIOO8JxrpW5QXxht_rynRmIuA0933KOHu7SK3Sj8nOU2tL-4T7DNvJ43HxoVK1UwrNg1pjs0SoZjaFjUBMfljvvcbRxjXlH_lQgUBdC-od5f_pN8cw-MoZA7hmvuZI4ys7CPfYW3VgG57CStmZYADy0srdg3NdHiQRcQC0JQA8N1hXDRpWrvz4LXpBISXmMThOjxZeY2TlWxNf363MvDawDspKEjKkIrRPP7JjiuczxOFA9TWleZ53a",
    url: "/news/shadows-of-the-past-review",
  },
];

// 2️⃣ ————————————————————————————————————————————
//  COMPONENT
// ————————————————————————————————————————————————
const News = () => {
  const carouselRef = useRef(null);

  // Smooth scroll helpers (arrow buttons)
  const scroll = (direction) => {
    if (!carouselRef.current) return;
    const { clientWidth } = carouselRef.current;
    const offset = direction === "left" ? -clientWidth : clientWidth;
    carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-x-hidden bg-gradient-to-b from-[#111418] to-[#1b2127]"
      style={{ fontFamily: "Plus Jakarta Sans, Noto Sans, sans-serif" }}
    >
      {/* Navigation */}
      <Navbar isAuthenticated={true} />

      {/* Page layout */}
      <div className="layout-container flex grow flex-col">
        <div className="flex flex-1 justify-center px-4 py-5 md:px-10 lg:px-40">
          <div className="layout-content-container flex w-full max-w-[960px] flex-1 flex-col">
            {/* 3️⃣ ————————————————— Featured Carousel ———————————————— */}
            <section className="relative">
              {/* Arrow buttons (hidden on mobile) */}
              <button
                aria-label="Scroll carousel left"
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[#101419]/80 p-2 backdrop-blur md:block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                aria-label="Scroll carousel right"
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[#101419]/80 p-2 backdrop-blur md:block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Carousel container */}
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scroll-smooth px-1 py-4 md:px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
              >
                {featuredNews.map((news) => (
                  <article
                    key={news.id}
                    className="relative flex min-w-[16rem] max-w-[18rem] snap-center flex-1 flex-col gap-4 rounded-xl md:min-w-[18rem]"
                  >
                    {/* Background image */}
                    <a
                      href={news.url}
                      className="aspect-video w-full flex-shrink-0 overflow-hidden rounded-xl bg-center bg-cover"
                      style={{ backgroundImage: `url(${news.img})` }}
                    >
                      <span className="sr-only">{news.title}</span>
                    </a>

                    {/* Text */}
                    <div className="flex flex-col gap-1 px-1">
                      <a
                        href={news.url}
                        className="line-clamp-2 text-base font-medium leading-tight text-[#f6f6f6] hover:underline"
                      >
                        {news.title}
                      </a>
                      <p className="line-clamp-2 text-sm leading-normal text-[#95a4b8]">
                        {news.description}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* 4️⃣ ————————————————— Latest News List ———————————————— */}
            <h2 className="px-1 pt-6 text-[22px] font-bold leading-tight tracking-[-0.015em] text-[#f6f6f6] md:px-4">
              Latest News
            </h2>
            <section className="flex flex-col px-1 md:px-4">
              {latestNews.map((news) => (
                <article
                  key={news.id}
                  className="group my-4 flex flex-col gap-4 rounded-xl p-4 transition-colors hover:bg-[#ffffff0d] md:flex-row md:items-stretch"
                >
                  {/* Text */}
                  <div className="flex flex-[2_2_0px] flex-col gap-1">
                    <p className="text-sm font-normal leading-normal text-[#95a4b8]">{news.category}</p>
                    <a
                      href={news.url}
                      className="text-base font-bold leading-tight text-[#f6f6f6] hover:underline"
                    >
                      {news.title}
                    </a>
                    <p className="text-sm font-normal leading-normal text-[#95a4b8]">
                      {news.description}
                    </p>
                  </div>

                  {/* Cover image (hidden on xs) */}
                  <a
                    href={news.url}
                    className="aspect-video w-full flex-1 overflow-hidden rounded-xl bg-cover bg-center md:block"
                    style={{ backgroundImage: `url(${news.img})` }}
                  >
                    <span className="sr-only">{news.title}</span>
                  </a>
                </article>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
