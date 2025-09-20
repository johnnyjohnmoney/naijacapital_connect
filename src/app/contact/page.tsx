"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    name: "Email",
    description: "Send us an email anytime",
    icon: EnvelopeIcon,
    contact: "info@naijaconnectcapital.com",
  },
  {
    name: "Phone",
    description: "Call us during business hours",
    icon: PhoneIcon,
    contact: "+234 901 234 5678",
  },
  {
    name: "Office",
    description: "Visit us at our headquarters",
    icon: MapPinIcon,
    contact: "Lagos, Nigeria",
  },
  {
    name: "Hours",
    description: "Monday to Friday",
    icon: ClockIcon,
    contact: "9:00 AM - 6:00 PM WAT",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Contact form data:", data);
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Contact Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Have questions about investing with NaijaConnect Capital? We're here
            to help you make informed investment decisions.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-lg lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Get in Touch
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                We'd love to hear from you. Send us a message and we'll respond
                as soon as possible.
              </p>

              <dl className="mt-10 space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.name} className="flex gap-x-4">
                    <dt className="flex-none">
                      <span className="sr-only">{item.name}</span>
                      <item.icon
                        className="h-7 w-6 text-gray-400"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd>
                      <div className="text-base font-semibold text-gray-900">
                        {item.name}
                      </div>
                      <div className="mt-1 text-base leading-6 text-gray-600">
                        {item.description}
                      </div>
                      <div className="mt-1 text-base leading-6 text-gray-600">
                        {item.contact}
                      </div>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 px-6 py-10 sm:px-10 lg:px-8 lg:py-8">
              <h3 className="text-lg font-semibold leading-7 text-gray-900">
                Send us a message
              </h3>

              {submitSuccess && (
                <div className="mt-4 rounded-md bg-green-50 p-4">
                  <div className="text-sm text-green-700">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-6"
              >
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      First name
                    </label>
                    <div className="mt-2.5">
                      <input
                        {...register("firstName")}
                        type="text"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold leading-6 text-gray-900"
                    >
                      Last name
                    </label>
                    <div className="mt-2.5">
                      <input
                        {...register("lastName")}
                        type="text"
                        className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      {...register("email")}
                      type="email"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Phone number (optional)
                  </label>
                  <div className="mt-2.5">
                    <input
                      {...register("phone")}
                      type="tel"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Subject
                  </label>
                  <div className="mt-2.5">
                    <input
                      {...register("subject")}
                      type="text"
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold leading-6 text-gray-900"
                  >
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      {...register("message")}
                      rows={4}
                      className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.message.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="block w-full rounded-md bg-green-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Send message"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Quick answers to common questions about investing with
              NaijaConnect Capital.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl">
            <dl className="space-y-8">
              <div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  What is the minimum investment amount?
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  The minimum investment varies by opportunity, typically
                  starting from ₦250,000. Each investment opportunity has its
                  own minimum threshold clearly displayed.
                </dd>
              </div>

              <div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  How are investment opportunities vetted?
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Our expert team conducts thorough due diligence including
                  financial analysis, market research, management assessment,
                  and risk evaluation before any opportunity is listed on our
                  platform.
                </dd>
              </div>

              <div>
                <dt className="text-lg font-semibold leading-7 text-gray-900">
                  How do I track my investments?
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Once you create an account and make investments, you can track
                  all your investments through your personalized dashboard,
                  which provides real-time updates and performance metrics.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
