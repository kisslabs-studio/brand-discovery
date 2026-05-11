const TOTAL = 10
const CLIENT = 'Arakiko'
const FORMSPREE = 'https://formspree.io/f/mnjwjvnb'
let cur = 1

function show(n) {
  document
    .querySelectorAll('.section-card')
    .forEach((el) => el.classList.remove('active'))
  const t = document.querySelector(`[data-section="${n}"]`)
  if (t) {
    t.classList.add('active')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  cur = n
  const pct = Math.round(((n - 1) / (TOTAL - 1)) * 100)
  document.getElementById('pFill').style.width = pct + '%'
  document.getElementById('pLabel').textContent =
    n === TOTAL ? 'Completed' : `Section ${n} of ${TOTAL - 1}`
}

function next() {
  if (validate(cur)) show(cur + 1)
}
function prev() {
  show(cur - 1)
}

function validate(n) {
  const sec = document.querySelector(`[data-section="${n}"]`)
  let ok = true
  // Text / email / textarea
  sec.querySelectorAll('[data-req="1"]').forEach((el) => {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      const err = document.getElementById('e_' + el.id)
      const val = el.value.trim()
      if (!val) {
        el.classList.add('invalid')
        if (err) err.classList.add('show')
        ok = false
      } else {
        el.classList.remove('invalid')
        if (el.dataset.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          el.classList.add('invalid')
          if (err) {
            err.textContent = 'Please enter a valid email address.'
            err.classList.add('show')
          }
          ok = false
        } else {
          if (err) err.classList.remove('show')
        }
      }
    }
  })
  // Radio groups and scale groups
  sec
    .querySelectorAll(
      '[data-type="radio"][data-req="1"], [data-type="scale"][data-req="1"]',
    )
    .forEach((el) => {
      const err = document.getElementById('e_' + el.id)
      if (!el.querySelector('input:checked')) {
        if (err) err.classList.add('show')
        ok = false
      } else {
        if (err) err.classList.remove('show')
      }
    })
  // Checkbox groups
  sec.querySelectorAll('[data-type="checkbox"][data-req="1"]').forEach((el) => {
    const err = document.getElementById('e_' + el.id)
    if (!el.querySelector('input:checked')) {
      if (err) err.classList.add('show')
      ok = false
    } else {
      if (err) err.classList.remove('show')
    }
  })
  return ok
}

// Enforce checkbox max
document.addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    const g = e.target.closest('[data-type="checkbox"]')
    if (g && g.dataset.max) {
      const max = parseInt(g.dataset.max)
      if (g.querySelectorAll('input:checked').length > max)
        e.target.checked = false
    }
    e.target
      .closest('.option-item')
      ?.classList.toggle('selected', e.target.checked)
  }
  if (e.target.type === 'radio') {
    const g = e.target.closest('.options-list')
    if (g)
      g.querySelectorAll('.option-item').forEach((item) =>
        item.classList.toggle(
          'selected',
          item.querySelector('input') === e.target,
        ),
      )
  }
})

function collectAll() {
  const out = []
  const push = (q, a) => out.push({ q, a })

  const tv = (id) => (document.getElementById(id)?.value || '').trim()
  const rv = (name) =>
    document.querySelector(`[name="${name}"]:checked`)?.value || ''
  const cv = (id) =>
    Array.from(document.querySelectorAll(`#${id} input:checked`))
      .map((x) => x.value)
      .join(', ')
  const sv = (id) => {
    const el = document.getElementById(id)
    if (!el) return ''
    const poles = el.closest('.question')?.querySelectorAll('.scale-poles span')
    const l = poles?.[0]?.innerText || ''
    const r = poles?.[1]?.innerText || ''
    const v = el.querySelector('input:checked')?.value || ''
    return v ? `${l} ↔ ${r}: ${v}/5` : ''
  }

  push('Name', tv('q_name'))
  push('Email', tv('q_email'))
  push('Role', tv('q_role'))
  push('About the brand', tv('q_about'))
  push('What customers say', tv('q_customers_say'))
  push('Current business stage', rv('q_stage'))
  push('Stage in 12–24 months', tv('q_stage_next'))
  push('Positioning frustrations', tv('q_positioning_frustration'))
  push('Hard conversations', tv('q_hard_convos'))
  push('If project succeeds…', tv('q_success_easier'))
  push('Brand location / markets', tv('q_location'))
  push('Top competitors', tv('q_competitors'))
  push('When you lose a sale', tv('q_lose_sale'))
  push('Compared / confused with', tv('q_compared'))
  push("Category customers think you're in", tv('q_category'))
  push('Why customers choose you', tv('q_why_choose'))
  push('Not the right choice if…', tv('q_not_right'))
  push('Flag in the ground promise', tv('q_flag'))
  push('Known primarily for', tv('q_known_for'))
  push('Legal/regulatory claims constraints', tv('q_claims'))
  push('Business type', rv('q_biz_type'))
  push('Primary buyer', tv('q_primary_buyer'))
  push("Buyer's problem", tv('q_buyer_problem'))
  push('Purchase trigger', tv('q_buyer_trigger'))
  push('Buyer objections', tv('q_buyer_objections'))
  push('Not the right customer', tv('q_not_buyer'))
  push('Audience gender', rv('q_gender'))
  push('Audience age', rv('q_age'))
  push('Audience education', rv('q_edu'))
  push('Audience city', tv('q_city'))
  push('Audience occupation', tv('q_occupation'))
  push('Audience income', rv('q_income'))
  push('Audience problem', tv('q_aud_problem'))
  push('Audience trigger', tv('q_aud_trigger'))
  push('Audience objections', tv('q_aud_objections'))
  push('Lifestyle / wellness brands', tv('q_lifestyle_brands'))
  push('Where they work', rv('q_work'))
  push('Hobbies', tv('q_hobbies'))
  push('Relationship to alcohol', rv('q_alcohol_rel'))
  push('Occasion of use', tv('q_occasion'))
  push('Other audience notes', tv('q_audience_other'))
  push('Brand values', cv('q_values'))
  push('Brand adjectives', cv('q_adjectives'))
  push('Inspiration brands', tv('q_inspo_brands'))
  push(
    'Accessible ↔ Exclusive',
    document.querySelector('[name="q_s_access"]:checked')?.value || '',
  )
  push(
    'Simple ↔ Complex',
    document.querySelector('[name="q_s_simple"]:checked')?.value || '',
  )
  push(
    'Friendly ↔ Corporate',
    document.querySelector('[name="q_s_friendly"]:checked')?.value || '',
  )
  push(
    'Traditional ↔ Progressive',
    document.querySelector('[name="q_s_trad"]:checked')?.value || '',
  )
  push(
    'Serious ↔ Playful',
    document.querySelector('[name="q_s_serious"]:checked')?.value || '',
  )
  push(
    'Urban ↔ Natural',
    document.querySelector('[name="q_s_urban"]:checked')?.value || '',
  )
  push(
    'Ingredient-led ↔ Experience-led',
    document.querySelector('[name="q_s_ingredient"]:checked')?.value || '',
  )
  push(
    'Subtle ↔ Expressive',
    document.querySelector('[name="q_s_subtle"]:checked')?.value || '',
  )
  push(
    'Niche ↔ Mainstream',
    document.querySelector('[name="q_s_niche"]:checked')?.value || '',
  )
  push('Website primary purpose', rv('q_site_purpose'))
  push('CMS needed', rv('q_cms'))
  push('Pages needed', tv('q_pages'))
  push('Category education on site', tv('q_category_education'))
  push('Favourite websites', tv('q_fav_sites'))
  return out.filter((x) => x.a)
}

function downloadCSV() {
  const data = collectAll()
  const name = (document.getElementById('q_name')?.value || 'respondent')
    .trim()
    .replace(/[^a-z0-9]/gi, '_')
  const date = new Date().toISOString().split('T')[0]
  const rows = [
    ['Question', 'Answer'],
    ...data.map((r) => [
      '"' + r.q.replace(/"/g, '""') + '"',
      '"' + r.a.replace(/"/g, '""') + '"',
    ]),
  ]
  const csv = rows.map((r) => r.join(',')).join('\n')
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: `Arakiko_BrandDiscovery_${name}_${date}.csv`,
  })
  a.click()
  URL.revokeObjectURL(a.href)
}

async function submitForm() {
  if (!validate(cur)) return
  const btn = document.getElementById('submitBtn')
  btn.textContent = 'Submitting…'
  btn.disabled = true

  const data = collectAll()
  const name = (document.getElementById('q_name')?.value || 'Respondent').trim()
  const email = (document.getElementById('q_email')?.value || '').trim()

  const payload = {
    _subject: `Brand Discovery — ${CLIENT} — ${name}`,
    _replyto: email,
  }
  data.forEach((item) => {
    payload[item.q] = item.a
  })

  try {
    const res = await fetch(FORMSPREE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      show(cur + 1)
    } else {
      btn.textContent = 'Submit →'
      btn.disabled = false
      alert(
        'Something went wrong. Please try again, or download your responses and email them to caspianievers@me.com.',
      )
    }
  } catch (e) {
    btn.textContent = 'Submit →'
    btn.disabled = false
    alert(
      'Something went wrong. Please try again, or download your responses and email them to caspianievers@me.com.',
    )
  }
}

show(1)
