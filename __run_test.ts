import nodemailer from "nodemailer";

async function run() {
    const transporter = nodemailer.createTransport({
        host: "invalid.domain.xyz",
        port: 587,
        secure: false,
        auth: {
            user: "fakeuser",
            pass: "fakepwd",
        },
    });

    try {
        await transporter.verify();
        console.log("SUCCESS!");
    } catch (error: any) {
        console.log("FAIL:", error.message);
    }
}
run();
