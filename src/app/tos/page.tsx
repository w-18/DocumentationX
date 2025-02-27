export default async function TermsOfService() {
  return (
    <div className="min-h-screen text-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-white/10 rounded-2xl backdrop-blur-sm pt-12 pb-16 border border-white/10 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <header className="mb-16 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-300 mt-2">
              Effective: {new Date().toLocaleDateString()}
            </p>
            <p className="mt-4 text-gray-300">
              By accessing or using this service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </header>

          <div className="space-y-12 divide-y divide-white/10">
            {/* 1. Introduction */}
            <section className="pt-8 first:pt-0">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                1. Introduction
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Welcome to our documentation builder service. Our platform is designed to help you transform your technical content into professional documentation with ease. Your use of this service signifies your acceptance of these Terms of Service.
              </p>
            </section>

            {/* 2. User Accounts */}
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                2. User Accounts
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                You may register using a username and password or log in via Discord, GitHub, or Google. We collect only the information necessary for account creation and authentication (such as your username, user ID, and the associated service user ID, if applicable). Passwords are securely hashed using Bcrypt.
              </p>
            </section>

            {/* 3. User Responsibilities */}
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                3. User Responsibilities
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                You are responsible for maintaining the confidentiality of your account credentials and all activities under your account. You agree not to post, distribute, or otherwise make available content that is illegal, harmful, or infringes upon the rights of others.
              </p>
            </section>

            {/* 4. Content Ownership & Rights */}
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                4. Content Ownership & Rights
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                You retain full ownership of the content you create using our service. However, by posting content on our platform, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content solely for the purpose of operating and improving the service.
              </p>
            </section>

            {/* 5. Privacy & Data Handling */}
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                5. Privacy & Data Handling
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                We are committed to protecting your privacy and comply with all applicable data protection laws. We collect only minimal data necessary for authentication and service functionality, and all sensitive information is encrypted. Please review our Privacy Policy for detailed information regarding data collection, usage, and your rights.
              </p>
            </section>

            {/* 6. Liability & Disclaimers */}
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                6. Liability & Disclaimers
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                The service is provided on an &quot;as is&quot; basis without any warranties, express or implied. We shall not be liable for any damages arising from your use of the service, including but not limited to direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            {/* 7. Termination */}
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                7. Termination
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                We reserve the right to suspend or terminate your account immediately, with or without notice, if you violate these Terms of Service or engage in any activity that jeopardizes the integrity or operation of the service. Upon termination, your right to use the service will cease immediately.
              </p>
            </section>

            {/* 8. Governing Law & Dispute Resolution */}
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                8. Governing Law & Dispute Resolution
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                These Terms shall be governed by and construed in accordance with the applicable laws, without regard to conflict of laws principles. Any disputes arising from these Terms or your use of the service shall be subject to the exclusive jurisdiction of the appropriate courts.
              </p>
            </section>

            {/* 9. Changes to the Terms */}
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                9. Changes to the Terms
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                We reserve the right to modify these Terms at any time. Your continued use of the service after any changes indicates your acceptance of the updated Terms. It is your responsibility to review these Terms periodically.
              </p>
            </section>

            {/* 10. Contact Information */}
            <section className="pt-8">
              <h2 className="text-2xl font-semibold mb-6 pb-2 border-b border-blue-400/30 inline-block">
                10. Contact Information
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                If you have any questions or concerns regarding these Terms of Service, please contact us at{" "}
                <a 
                  href="mailto:docx-support@w18.one" 
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline underline-offset-4"
                >
                  docx-support@w18.one
                </a>.
              </p>
            </section>
          </div>

          <footer className="mt-16 pt-8 border-t border-white/10">
            <p className="text-center text-gray-300 text-sm">
              © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_WEBSITE_NAME}. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
