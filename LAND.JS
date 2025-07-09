document.addEventListener("DOMContentLoaded", () => {
    const enterButton = document.querySelector(".enter-button");
    const content = document.querySelector(".content");
    const countdownContainer = document.querySelector(".countdown-container");
    const countdownNumber = document.querySelector(".countdown-number");

    // Initial animation for content
    gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        delay: 0.5
    });

    // Click event for the enter button
    enterButton.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default link behavior
        const href = enterButton.href;

        // Animate content out
        gsap.to(content, {
            duration: 0.5,
            opacity: 0,
            scale: 0.9,
            ease: "power1.in"
        });

        // Start countdown animation
        gsap.to(countdownContainer, {
            opacity: 1,
            visibility: "visible",
            duration: 0.5,
            onComplete: () => {
                const tl = gsap.timeline();

                tl.to(countdownNumber, {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 0.5, // shorter duration
                    ease: "power2.out"
                }).to(countdownNumber, {
                    opacity: 0,
                    duration: 0.5, // shorter duration
                    ease: "power2.in"
                }, "+=0.5");

                tl.to(document.body, {
                    backgroundColor: "#fff",
                    duration: 1,
                    onComplete: () => {
                        window.location.href = href;
                    }
                });
            }
        });
    });
});