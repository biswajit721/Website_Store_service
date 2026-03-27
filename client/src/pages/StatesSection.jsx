"use client"

import { useEffect, useRef, useState } from "react"
import { Users, CheckCircle, Zap, Award } from "lucide-react"

const stats = [
  {
    label: "Happy Clients",
    value: 50000,
    suffix: "+",
    icon: Users,
  },
  {
    label: "Projects Completed",
    value: 120000,
    suffix: "+",
    icon: CheckCircle,
  },
  {
    label: "Active Freelancers",
    value: 15000,
    suffix: "+",
    icon: Zap,
  },
  {
    label: "Satisfaction Rate",
    value: 99,
    suffix: "%",
    icon: Award,
  },
]

 function StatsSection() {
  const sectionRef = useRef(null)
  const [startCount, setStartCount] = useState(false)
  const [counts, setCounts] = useState(stats.map(() => 0))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!startCount) return

    stats.forEach((stat, index) => {
      let start = 0
      const end = stat.value
      const duration = 1500
      const stepTime = Math.max(Math.floor(duration / end), 10)

      const counter = setInterval(() => {
        start += Math.ceil(end / 100)
        if (start >= end) {
          start = end
          clearInterval(counter)
        }

        setCounts((prev) => {
          const updated = [...prev]
          updated[index] = start
          return updated
        })
      }, stepTime)
    })
  }, [startCount])

  return (
    <section ref={sectionRef} className="bg-black py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <Icon className="h-7 w-7 text-emerald-400" />
              </div>

              <h3 className="text-3xl font-bold text-white">
                {counts[i]}
                {stat.suffix}
              </h3>

              <p className="mt-2 text-sm text-zinc-400">
                {stat.label}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default StatsSection
