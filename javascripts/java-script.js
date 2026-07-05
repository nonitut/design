document.addEventListener("DOMContentLoaded", () => {

    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");

    if (dot && ring) {

        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + "px";
            dot.style.top = mouseY + "px";
        });

        function loop() {
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.left = ringX + "px";
            ring.style.top = ringY + "px";
            requestAnimationFrame(loop);
        }

        loop();

        document.querySelectorAll("a, .track-feature, .track-small, .work").forEach(el => {
            el.addEventListener("mouseenter", () => ring.classList.add("big"));
            el.addEventListener("mouseleave", () => ring.classList.remove("big"));
        });
    }

    const WA_LINK = "https://wa.me/79167797756?text=%D0%A5%D0%BE%D1%87%D1%83%20%D0%BD%D0%B0%20%D0%BA%D0%BE%D0%BD%D1%81%D1%83%D0%BB%D1%8C%D1%82%D0%B0%D1%86%D0%B8%D1%8E";

    document.querySelectorAll(".nav-cta, .hero-right-cell .btn-main, .cta-strip .btn-invert").forEach(btn => {
        btn.href = WA_LINK;
        btn.target = "_blank";
        btn.rel = "noopener noreferrer";
    });

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth <= 768;

    if (!window.gsap || reduceMotion) {
        document.querySelectorAll("[data-count]").forEach(el => {
            el.textContent = el.dataset.count + (el.dataset.suffix || "");
        });
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (!isMobile) {
        gsap.timeline({ defaults: { ease: "power3.out" } })
            .from(".hero-kicker", { opacity: 0, y: 14, duration: .5 })
            .from(".hero-h1", { opacity: 0, y: 26, duration: .7 }, "-=0.25")
            .from(".hero-lead", { opacity: 0, y: 14, duration: .5 }, "-=0.35")
            .from(".hero-right-cell", { opacity: 0, x: 18, duration: .5 }, "-=0.4");
    }

    if (!isMobile) {

        gsap.set(".reveal", { opacity: 0, y: 22 });

        ScrollTrigger.batch(".reveal", {
            start: "top 85%",
            once: true,
            onEnter: batch => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: .6,
                    stagger: .08
                });
            }
        });

        gsap.utils.toArray(".path-item").forEach(item => {

            gsap.from(item, {
                opacity: 0,
                x: -12,
                duration: .45,
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    once: true
                }
            });

            const d = item.querySelector(".path-dot");

            if (d) {
                gsap.from(d, {
                    scale: 0,
                    duration: .4,
                    ease: "back.out(2.4)",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%",
                        once: true
                    }
                });
            }
        });

        document.querySelectorAll("[data-count]").forEach(el => {

            const obj = { v: 0 };

            ScrollTrigger.create({
                trigger: el,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(obj, {
                        v: Number(el.dataset.count),
                        duration: 1,
                        onUpdate: () => {
                            el.textContent = Math.round(obj.v) + (el.dataset.suffix || "");
                        }
                    });
                }
            });
        });

        gsap.from(".cta-strip", {
            opacity: 0,
            y: 24,
            scrollTrigger: {
                trigger: ".cta-strip",
                start: "top 90%",
                once: true
            }
        });
    }

    const wrapper = document.querySelector(".gallery-wrapper");
    const track = document.querySelector(".gallery-track");

    if (wrapper && track) {

        let tween;
        let maxScroll = 0;

        function calc() {
            maxScroll = track.scrollWidth - window.innerWidth;
        }

        function init() {

            if (tween) tween.kill();
            ScrollTrigger.getById("gallery")?.kill();

            gsap.set(track, { x: 0 });

            calc();

            if (maxScroll <= 0) return;

            tween = gsap.to(track, {
                x: -maxScroll,
                ease: "none",
                scrollTrigger: {
                    id: "gallery",
                    trigger: wrapper,
                    start: "top top",
                    end: () => "+=" + maxScroll,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });

            ScrollTrigger.refresh();
        }

        function debounce(fn, t) {
            let id;
            return () => {
                clearTimeout(id);
                id = setTimeout(fn, t);
            };
        }

        init();

        window.addEventListener("resize", debounce(init, 150));

        window.addEventListener("load", () => {
            init();
        });

        if (!isMobile) {
            wrapper.addEventListener("wheel", (e) => {

                if (!tween) return;

                e.preventDefault();

                const st = tween.scrollTrigger;
                const current = st.progress * maxScroll;

                let next = current + e.deltaY * 0.6;
                next = Math.max(0, Math.min(maxScroll, next));

                st.scroll(st.start + (next / maxScroll) * (st.end - st.start));

            }, { passive: false });
        }
    }
});
