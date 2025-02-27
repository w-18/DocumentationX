"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BsPlusCircle, BsTrash } from "react-icons/bs"
import { FiInfo, FiAlertTriangle, FiXOctagon } from "react-icons/fi"
import clsx from "clsx"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"

type GuideField = {
  field_name: string
  field_value: string
  field_type: "none" | "note" | "danger" | "warning"
  field_notation: string | null
}

export default function GuideCreator() {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<GuideField[]>([])
  const [showCaptchaModal, setShowCaptchaModal] = useState(false)
  const captchaRef = useRef<TurnstileInstance | null>(null)

  const addField = () => {
    setFields([...fields, { field_name: "", field_value: "", field_type: "none", field_notation: null }])
  }

  const updateField = (index: number, field: Partial<GuideField>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...field }
    if (field.field_type === "none") {
      newFields[index].field_notation = null
    } else if (newFields[index].field_notation === null) {
      newFields[index].field_notation = ""
    }
    setFields(newFields)
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleCaptchaSuccess = async (token: string) => {
    // Here you would typically verify the token with your backend
    console.log("Captcha token:", token)
    setShowCaptchaModal(false)
    // Proceed with guide submission
    console.log("Guide submitted:", { title, description, fields })
  }

  const Card = ({ field }: { field: GuideField }) => {
    const noteColor = "border-l-4 border-emerald-400 bg-emerald-400/15 text-emerald-300"
    const warningColor = "border-l-4 border-amber-400 bg-amber-400/15 text-amber-300"
    const dangerColor = "border-l-4 border-rose-500 bg-rose-500/15 text-rose-400"

    return (
      <div
        className={clsx(
          "relative group w-full max-w-2xl mx-auto",
          "bg-gradient-to-br from-gray-900/80 to-gray-800/80",
          "border border-gray-700/50",
          "rounded-xl p-6 mb-6",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          "text-gray-100",
          "hover:border-gray-600/50",
          "backdrop-blur-sm",
          "overflow-hidden",
          "transform hover:-translate-y-1.5 active:translate-y-0",
          "active:scale-[0.985]",
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -rotate-[30deg] scale-150" />

        <h3 className="font-semibold text-xl mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
          {field.field_name}
        </h3>

        <div className="text-gray-300 leading-relaxed mb-4 transition-colors duration-300 group-hover:text-gray-100">
          {field.field_value}
        </div>

        {field.field_type !== "none" && (
          <div
            className={clsx(
              "p-4 rounded-lg",
              "transition-all duration-300 ease-in-out",
              "flex items-center gap-3",
              "hover:bg-opacity-20",
              field.field_type === "note" && noteColor,
              field.field_type === "warning" && warningColor,
              field.field_type === "danger" && dangerColor,
            )}
          >
            <div className="shrink-0">
              {field.field_type === "note" && <FiInfo className="w-5 h-5 animate-pulse" />}
              {field.field_type === "warning" && <FiAlertTriangle className="w-5 h-5 animate-pulse" />}
              {field.field_type === "danger" && <FiXOctagon className="w-5 h-5 animate-pulse" />}
            </div>
            <span className="font-medium tracking-wide">{field.field_notation}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Create Your Guide
        </h1>

        <div className="max-w-3xl mx-auto bg-white/10 rounded-xl backdrop-blur-sm p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-4">Step 1: Basic Information</h2>
                <input
                  type="text"
                  placeholder="Guide Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 mb-4 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:border-blue-400"
                />
                <textarea
                  placeholder="Guide Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 mb-4 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:border-blue-400 h-32"
                />
                <button
                  onClick={nextStep}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Next
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-4">Step 2: Add Guide Fields</h2>
                {fields.map((field, index) => (
                  <div key={index} className="mb-4 p-4 bg-white/5 rounded-md">
                    <input
                      type="text"
                      placeholder="Field Name"
                      value={field.field_name}
                      onChange={(e) => updateField(index, { field_name: e.target.value })}
                      className="w-full p-2 mb-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:border-blue-400"
                    />
                    <textarea
                      placeholder="Field Value"
                      value={field.field_value}
                      onChange={(e) => updateField(index, { field_value: e.target.value })}
                      className="w-full p-2 mb-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:border-blue-400 h-24"
                    />
                    <select
                      value={field.field_type}
                      onChange={(e) => updateField(index, { field_type: e.target.value as GuideField["field_type"] })}
                      className="w-full p-2 mb-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:border-blue-400"
                    >
                      <option value="none">None</option>
                      <option value="note">Note</option>
                      <option value="danger">Danger</option>
                      <option value="warning">Warning</option>
                    </select>
                    {field.field_type !== "none" && (
                      <input
                        type="text"
                        placeholder="Field Notation"
                        value={field.field_notation || ""}
                        onChange={(e) => updateField(index, { field_notation: e.target.value })}
                        className="w-full p-2 mb-2 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:border-blue-400"
                      />
                    )}
                    <button
                      onClick={() => removeField(index)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-300"
                    >
                      <BsTrash />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addField}
                  className="w-full py-3 mb-4 bg-green-600 hover:bg-green-700 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <BsPlusCircle className="mr-2" /> Add Field
                </button>
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="py-3 px-6 bg-gray-600 hover:bg-gray-700 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-semibold mb-4">Step 3: Review Your Guide</h2>
                <div className="bg-white/5 p-6 rounded-md mb-4">
                  <h3 className="text-xl font-semibold mb-2">{title}</h3>
                  <p className="text-gray-300 mb-4">{description}</p>
                  {fields.map((field, index) => (
                    <Card key={index} field={field} />
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={prevStep}
                    className="py-3 px-6 bg-gray-600 hover:bg-gray-700 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setShowCaptchaModal(true)}
                    className="py-3 px-6 bg-green-600 hover:bg-green-700 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Submit Guide
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Captcha Modal */}
      {showCaptchaModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="w-full max-w-md p-8 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/15 relative">
            <button
              onClick={() => setShowCaptchaModal(false)}
              className="absolute top-2 right-2 text-gray-300 text-xl font-bold"
            >
              &times;
            </button>
            <div className="flex justify-center">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                options={{ size: "normal", theme: "dark" }}
                onSuccess={handleCaptchaSuccess}
                ref={captchaRef}
              />
            </div>
          </div>
        </div>
      )}

      {/* Custom animation keyframes */}
      <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
    </div>
  )
}

