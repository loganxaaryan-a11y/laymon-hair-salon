import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowUpRight,
  Brush,
  CalendarCheck,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  Menu,
  Palette,
  Phone,
  Scissors,
  Sparkles,
  Star,
  Waves,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const PHONE_DISPLAY = '+1 647-347-9099'
const PHONE_HREF = 'tel:+16473479099'
const MAPS_URL = 'https://maps.google.com/?daddr=2588%20Danforth%20Ave%2C%20Toronto%2C%20ON%20M4C%201L3%2C%20Canada'
const REVIEWS_URL = 'https://www.google.com/search?q=Laymon+Hair+Salon+Toronto+reviews'

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Experience', href: '#experience' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Visit', href: '#visit' },
]

type Service = {
  id: string
  icon: LucideIcon
  title: string
  eyebrow: string
  description: string
  items: string[]
}

const services: Service[] = [
  {
    id: 'cuts',
    icon: Scissors,
    title: 'Cuts & finish',
    eyebrow: 'Shape first',
    description:
      'Considered cutting for everyday wear, special occasions, growing-out phases, and curls that need their own architecture.',
    items: ['Women’s haircut', 'Children’s haircut', 'Curly hair shaping', 'Blow-dry & finish'],
  },
  {
    id: 'colour',
    icon: Palette,
    title: 'Colour & dimension',
    eyebrow: 'Light, placed well',
    description:
      'Dimensional colour work designed around your base, maintenance rhythm, and the way your hair moves between appointments.',
    items: ['Balayage', 'Highlights', 'Hair colouring', 'Gloss & tonal refresh'],
  },
  {
    id: 'texture',
    icon: Waves,
    title: 'Texture & smoothing',
    eyebrow: 'Control without stiffness',
    description:
      'From softening frizz to changing your curl pattern, texture services are planned with condition, upkeep, and longevity in mind.',
    items: ['Keratin treatment', 'Perm', 'Permanent straightening', 'Texture consultation'],
  },
  {
    id: 'extensions',
    icon: Brush,
    title: 'Length & protective styling',
    eyebrow: 'Built with care',
    description:
      'Extension, weave, and braid appointments begin with a practical conversation about density, comfort, and the finish you want.',
    items: ['Hair extensions', 'Hair weaves', 'Hair braiding', 'Occasion styling'],
  },
  {
    id: 'beauty',
    icon: Sparkles,
    title: 'Beauty & detail',
    eyebrow: 'The finishing notes',
    description:
      'A compact beauty menu for the details that complete the look—precision grooming, skin care, nails, and traditional adornment.',
    items: ['Threading', 'Waxing', 'Facials', 'Manicure & pedicure', 'Henna design'],
  },
]

const gallery = [
  {
    src: `${import.meta.env.BASE_URL}images/detail-curling.webp`,
    alt: 'A stylist shaping soft curls with a curling iron',
    caption: 'The finish',
    className: 'gallery-item-large',
  },
  {
    src: `${import.meta.env.BASE_URL}images/detail-wash.webp`,
    alt: 'A guest receiving a relaxing hair wash at a salon basin',
    caption: 'The ritual',
    className: 'gallery-item-tall',
  },
  {
    src: `${import.meta.env.BASE_URL}images/salon-interior.webp`,
    alt: 'A modern salon interior with mirrors and styling chairs',
    caption: 'The room',
    className: 'gallery-item-wide',
  },
  {
    src: `${import.meta.env.BASE_URL}images/tools.webp`,
    alt: 'Hairdressing brushes, scissors, and colour tools held in a row',
    caption: 'The tools',
    className: 'gallery-item-small',
  },
]

const hours = ['Monday — Sunday', '11:00 AM — 7:00 PM']

type BookingFields = {
  name: string
  phone: string
  service: string
  day: string
  time: string
  notes: string
}

const initialFields: BookingFields = {
  name: '',
  phone: '',
  service: '',
  day: 'This week',
  time: 'Afternoon',
  notes: '',
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    document.documentElement.classList.add('motion-ready')
    const root = ref.current
    if (!root) return

    const targets = Array.from(root.querySelectorAll<HTMLElement>('.reveal'))
    if (!('IntersectionObserver' in window)) {
      targets.forEach((target) => target.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return ref
}

function FramedImage({
  src,
  alt,
  caption,
  className = '',
  priority = false,
}: {
  src: string
  alt: string
  caption?: string
  className?: string
  priority?: boolean
}) {
  return (
    <figure className={`framed-image reveal ${className}`}>
      <img src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />
      <svg aria-hidden="true" className="image-frame" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect className="frame-base" x="1" y="1" width="98" height="98" pathLength="1" />
        <rect className="frame-line" x="1" y="1" width="98" height="98" pathLength="1" />
      </svg>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    closeButtonRef.current?.focus()
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <a className="brand-mark" href="#top" aria-label="Laymon Hair Salon home">
          <span>Laymon</span>
          <small>Hair Salon</small>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <a className="header-phone" href={PHONE_HREF}>
            <Phone size={16} strokeWidth={1.8} aria-hidden="true" />
            <span>{PHONE_DISPLAY}</span>
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen(true)}
          >
            <Menu size={22} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`} id="mobile-menu" aria-hidden={!isOpen}>
        <button className="menu-backdrop" type="button" aria-label="Close menu" onClick={() => setIsOpen(false)} />
        <div className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="mobile-menu-top">
            <span>Menu</span>
            <button ref={closeButtonRef} type="button" aria-label="Close menu" onClick={() => setIsOpen(false)}>
              <X size={22} strokeWidth={1.7} aria-hidden="true" />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                {item.label}
                <ArrowUpRight size={18} strokeWidth={1.7} aria-hidden="true" />
              </a>
            ))}
          </nav>
          <a className="button-primary mobile-book" href={PHONE_HREF}>
            Call to book
            <Phone size={17} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </div>
    </>
  )
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="container-x hero-grid">
        <div className="hero-copy-block">
          <p className="hero-kicker reveal">Danforth Village · Toronto · By appointment</p>
          <h1 className="hero-title" id="hero-title">
            <span>Hair with</span>
            <span>
              <em>intention.</em>
            </span>
          </h1>
          <p className="hero-copy reveal">
            Precision cuts, dimensional colour, texture-aware styling, and beauty care—planned around your hair, your routine, and the way you want to feel when you leave.
          </p>
          <div className="hero-actions reveal">
            <a className="button-primary" href={PHONE_HREF}>
              Call to book
              <Phone size={17} strokeWidth={1.8} aria-hidden="true" />
            </a>
            <a className="button-secondary" href="#services">
              Explore services
              <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="hero-art" aria-label="Salon photography collage">
          <span className="hero-word" aria-hidden="true">
            Laymon
          </span>
          <FramedImage
            src={`${import.meta.env.BASE_URL}images/hero-blowdry.webp`}
            alt="A stylist blow drying a guest’s hair with a round brush"
            className="hero-primary"
            priority
          />
          <FramedImage
            src={`${import.meta.env.BASE_URL}images/detail-wash.webp`}
            alt="A guest’s hair being rinsed at a salon basin"
            className="hero-secondary"
          />
          <aside className="hero-appointment-card reveal" aria-label="Booking details">
            <CalendarCheck size={21} strokeWidth={1.7} aria-hidden="true" />
            <strong>Appointment preferred</strong>
            <span>Open daily · 11 AM—7 PM</span>
          </aside>
          <a className="hero-rating reveal" href={REVIEWS_URL} target="_blank" rel="noreferrer">
            <span className="stars" aria-hidden="true">
              <Star size={15} fill="currentColor" />
              <Star size={15} fill="currentColor" />
              <Star size={15} fill="currentColor" />
              <Star size={15} fill="currentColor" />
              <Star size={15} />
            </span>
            <strong>4.3</strong>
            <span>60 Google reviews</span>
          </a>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, groupIndex) => (
            <div className="marquee-group" key={groupIndex}>
              <span>Balayage</span>
              <span>Curly hair</span>
              <span>Keratin</span>
              <span>Threading</span>
              <span>Braids</span>
              <span>Extensions</span>
              <span>Colour</span>
              <span>Facials</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Services() {
  const [openId, setOpenId] = useState(services[0].id)

  return (
    <section className="section services-section" id="services" aria-labelledby="services-title">
      <div className="container-x section-grid">
        <div className="section-rail reveal">
          <p className="eyebrow">Services</p>
          <h2 id="services-title">Choose the appointment. We’ll shape the rest.</h2>
          <p>
            Every service starts with a short consultation, so the result works with your texture, density, maintenance preferences, and schedule.
          </p>
          <a href="#visit" className="text-link">
            Plan your visit
            <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>

        <div className="service-list">
          {services.map((service, index) => {
            const Icon = service.icon
            const isOpen = openId === service.id
            return (
              <article className={`service-item reveal ${isOpen ? 'is-open' : ''}`} key={service.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`service-panel-${service.id}`}
                  onClick={() => setOpenId(isOpen ? '' : service.id)}
                >
                  <span className="service-index">0{index + 1}</span>
                  <Icon className="service-icon" size={24} strokeWidth={1.35} aria-hidden="true" />
                  <span className="service-heading">
                    <small>{service.eyebrow}</small>
                    <strong>{service.title}</strong>
                  </span>
                  <ChevronDown className="service-chevron" size={22} strokeWidth={1.6} aria-hidden="true" />
                </button>
                <div className="service-detail" id={`service-panel-${service.id}`} aria-hidden={!isOpen}>
                  <div>
                    <p>{service.description}</p>
                    <ul>
                      {service.items.map((item) => (
                        <li key={item}>
                          <Check size={15} strokeWidth={2} aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section className="section experience-section" id="experience" aria-labelledby="experience-title">
      <div className="container-x experience-grid">
        <div className="experience-media">
          <FramedImage
            src={`${import.meta.env.BASE_URL}images/salon-interior.webp`}
            alt="A polished salon interior with mirrors, plants, and styling stations"
            caption="A calm, appointment-led visit"
          />
        </div>
        <div className="experience-copy">
          <p className="eyebrow reveal">Experience</p>
          <h2 className="reveal" id="experience-title">
            The craft is quiet. The result is not.
          </h2>
          <p className="experience-lede reveal">
            Laymon keeps the process focused: understand the hair, agree on the direction, then execute with care. No rushed handoff, no one-size-fits-all finish.
          </p>

          <div className="process-list">
            <article className="process-step reveal">
              <span>01</span>
              <div>
                <h3>Consult</h3>
                <p>Talk through your reference, hair history, routine, and how much maintenance you actually want.</p>
              </div>
            </article>
            <article className="process-step reveal">
              <span>02</span>
              <div>
                <h3>Craft</h3>
                <p>Cut, colour, texture, or detail work is paced around the service—not squeezed into a generic time slot.</p>
              </div>
            </article>
            <article className="process-step reveal">
              <span>03</span>
              <div>
                <h3>Care</h3>
                <p>Leave with practical styling guidance, so the appointment still works after the first wash.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section className="section gallery-section" id="gallery" aria-labelledby="gallery-title">
      <div className="container-x">
        <div className="gallery-heading reveal">
          <p className="eyebrow">Gallery</p>
          <h2 id="gallery-title">A closer look at the ritual.</h2>
          <p>Texture, tools, movement, and finish—the details that make an appointment feel considered.</p>
        </div>

        <div className="gallery-grid">
          {gallery.map((item) => (
            <FramedImage key={item.src} src={item.src} alt={item.alt} caption={item.caption} className={item.className} />
          ))}
          <div className="gallery-statement reveal">
            <span>Not a template.</span>
            <strong>A finish that belongs to you.</strong>
            <a href="#visit" className="text-link">
              Start with a consult
              <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Booking() {
  const [fields, setFields] = useState<BookingFields>(initialFields)
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFields, string>>>({})
  const [isPrepared, setIsPrepared] = useState(false)

  const selectedService = useMemo(
    () => services.find((service) => service.title === fields.service)?.title ?? fields.service,
    [fields.service],
  )

  const message = useMemo(() => {
    const lines = [
      'Hello Laymon Hair Salon, I would like to request an appointment.',
      `Name: ${fields.name}`,
      `Service: ${selectedService}`,
      `Preferred timing: ${fields.day}, ${fields.time}`,
      `Phone: ${fields.phone}`,
    ]
    if (fields.notes.trim()) lines.push(`Notes: ${fields.notes.trim()}`)
    return lines.join('\n')
  }, [fields, selectedService])

  const smsHref = `sms:+16473479099?&body=${encodeURIComponent(message)}`

  const updateField = (field: keyof BookingFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setIsPrepared(false)
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: Partial<Record<keyof BookingFields, string>> = {}
    if (!fields.name.trim()) nextErrors.name = 'Please add your name.'
    if (!fields.phone.trim()) nextErrors.phone = 'Please add a phone number.'
    if (!fields.service) nextErrors.service = 'Please choose a service.'
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setIsPrepared(true)
    }
  }

  return (
    <section className="section visit-section" id="visit" aria-labelledby="visit-title">
      <div className="container-x visit-grid">
        <div className="visit-copy">
          <p className="eyebrow reveal">Visit</p>
          <h2 className="reveal" id="visit-title">
            Book before you visit.
          </h2>
          <p className="visit-lede reveal">
            Laymon is most comfortable taking clients by appointment. Call directly, or prepare a text request with your service and preferred timing.
          </p>

          <div className="contact-stack">
            <a className="contact-line reveal" href={PHONE_HREF}>
              <Phone size={22} strokeWidth={1.5} aria-hidden="true" />
              <span>
                <small>Call or text</small>
                <strong>{PHONE_DISPLAY}</strong>
              </span>
              <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
            </a>
            <a className="contact-line reveal" href={MAPS_URL} target="_blank" rel="noreferrer">
              <MapPin size={22} strokeWidth={1.5} aria-hidden="true" />
              <span>
                <small>Find the salon</small>
                <strong>2588 Danforth Ave, Toronto</strong>
              </span>
              <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
            </a>
            <div className="contact-line reveal">
              <Clock3 size={22} strokeWidth={1.5} aria-hidden="true" />
              <span>
                <small>{hours[0]}</small>
                <strong>{hours[1]}</strong>
              </span>
            </div>
          </div>
        </div>

        <form className="booking-form reveal" onSubmit={onSubmit} noValidate>
          <div className="form-heading">
            <CalendarCheck size={24} strokeWidth={1.5} aria-hidden="true" />
            <div>
              <h3>Prepare a booking request</h3>
              <p>Nothing is sent until you open the text message.</p>
            </div>
          </div>

          <label>
            <span>Name</span>
            <input
              value={fields.name}
              onChange={(event) => updateField('name', event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'booking-name-error' : undefined}
              autoComplete="name"
              placeholder="Your name"
            />
            {errors.name ? <small id="booking-name-error">{errors.name}</small> : null}
          </label>

          <label>
            <span>Phone</span>
            <input
              value={fields.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'booking-phone-error' : undefined}
              autoComplete="tel"
              inputMode="tel"
              placeholder="Best number to reach you"
            />
            {errors.phone ? <small id="booking-phone-error">{errors.phone}</small> : null}
          </label>

          <label>
            <span>Service</span>
            <select
              value={fields.service}
              onChange={(event) => updateField('service', event.target.value)}
              aria-invalid={Boolean(errors.service)}
              aria-describedby={errors.service ? 'booking-service-error' : undefined}
            >
              <option value="">Choose a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
            {errors.service ? <small id="booking-service-error">{errors.service}</small> : null}
          </label>

          <div className="form-row">
            <label>
              <span>Preferred day</span>
              <select value={fields.day} onChange={(event) => updateField('day', event.target.value)}>
                <option>Today</option>
                <option>Tomorrow</option>
                <option>This week</option>
                <option>Next week</option>
              </select>
            </label>
            <label>
              <span>Preferred time</span>
              <select value={fields.time} onChange={(event) => updateField('time', event.target.value)}>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </label>
          </div>

          <label>
            <span>Notes <em>(optional)</em></span>
            <textarea
              value={fields.notes}
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Hair length, goal, timing constraints…"
              rows={4}
            />
          </label>

          <button className="button-primary form-submit" type="submit">
            Prepare request
            <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
          </button>

          <div className={`request-preview ${isPrepared ? 'is-visible' : ''}`} aria-live="polite">
            {isPrepared ? (
              <>
                <p>Your request is ready. Open it in your messaging app, review it, then send it to Laymon.</p>
                <pre>{message}</pre>
                <a className="button-secondary" href={smsHref}>
                  Open text message
                  <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
                </a>
              </>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-x footer-grid">
        <a className="footer-word" href="#top" aria-label="Back to top">
          Laymon
        </a>
        <div>
          <p>Hair Salon & Aesthetics</p>
          <a href={MAPS_URL} target="_blank" rel="noreferrer">
            2588 Danforth Ave, Toronto, ON M4C 1L3
          </a>
        </div>
        <div>
          <p>Open daily · 11 AM—7 PM</p>
          <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
        </div>
        <nav aria-label="Footer navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="container-x footer-bottom">
        <span>© {new Date().getFullYear()} Laymon Hair Salon</span>
        <span>Appointments preferred</span>
      </div>
    </footer>
  )
}

export default function Home() {
  const pageRef = useReveal<HTMLDivElement>()

  return (
    <div ref={pageRef} className="site-shell">
      <Header />
      <main>
        <Hero />
        <Services />
        <Experience />
        <Gallery />
        <Booking />
      </main>
      <Footer />
      <div className="mobile-cta" aria-label="Quick booking actions">
        <a href={PHONE_HREF}>
          <Phone size={18} strokeWidth={1.8} aria-hidden="true" />
          Call
        </a>
        <a href="#visit">
          Book
          <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
