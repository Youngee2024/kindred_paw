export const coveragePlans = [
  {
    id: 'essential',
    name: 'Essential Care',
    description: 'Everyday protection for common accidents and illness.',
    basePremium: 4500,
    annualLimit: '₦500,000',
    reimbursement: '70%',
    deductible: '₦25,000',
    benefits: ['Accidents and illness', 'Diagnostic tests', 'Prescription medication'],
  },
  {
    id: 'balanced',
    name: 'Balanced Care',
    description: 'Broader protection with stronger annual benefits.',
    basePremium: 7500,
    annualLimit: '₦1,200,000',
    reimbursement: '80%',
    deductible: '₦15,000',
    benefits: ['Everything in Essential', 'Surgery and hospital stays', 'Specialist consultations', 'Emergency care'],
    popular: true,
  },
  {
    id: 'complete',
    name: 'Complete Care',
    description: 'Our highest level of support for complex care needs.',
    basePremium: 11500,
    annualLimit: '₦2,500,000',
    reimbursement: '90%',
    deductible: '₦10,000',
    benefits: ['Everything in Balanced', 'Hereditary conditions', 'Physiotherapy and rehabilitation', 'Dental accident care'],
  },
]

export function getPetAge(birthday) {
  if (!birthday) return 0
  const birthDate = new Date(`${birthday}T00:00:00`)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const beforeBirthday = today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
  if (beforeBirthday) age -= 1
  return Math.max(0, age)
}

const roundPremium = (value) => Math.round(value / 100) * 100

export function calculateQuotes(pet) {
  const age = getPetAge(pet.birthday)
  let riskFactor = 1
  const factors = []

  const typeProfiles = {
    dog: ['Dog rate', 1],
    cat: ['Cat rate', 0.9],
    rabbit: ['Rabbit rate', 0.85],
    bird: ['Bird rate', 0.8],
    reptile: ['Reptile rate', 0.9],
  }
  const [typeLabel, typeFactor] = typeProfiles[pet.type] || ['Standard companion rate', 1]
  riskFactor *= typeFactor
  factors.push(['Pet type', typeLabel, typeFactor])

  const ageFactor = age < 1 ? 1.1 : age <= 5 ? 1 : age <= 8 ? 1.25 : 1.55
  riskFactor *= ageFactor
  factors.push(['Age', `${age} year${age === 1 ? '' : 's'} old`, ageFactor])

  const higherRiskBreeds = ['bulldog', 'german-shepherd', 'persian', 'african-grey']
  const mixedBreeds = ['mixed', 'mixed-cat', 'mixed-rabbit']
  const breedFactor = higherRiskBreeds.includes(pet.breed) ? 1.2 : mixedBreeds.includes(pet.breed) ? 0.95 : 1.05
  riskFactor *= breedFactor
  factors.push(['Breed profile', higherRiskBreeds.includes(pet.breed) ? 'Higher care profile' : mixedBreeds.includes(pet.breed) ? 'Mixed breed' : 'Standard profile', breedFactor])

  if (pet.medication === 'yes') {
    riskFactor *= 1.25
    factors.push(['Medical history', 'Current medication', 1.25])
  }
  if (pet.surgery?.trim()) {
    riskFactor *= 1.15
    factors.push(['Surgery history', 'Previous surgery reported', 1.15])
  }
  if (pet.weight === '25+') {
    riskFactor *= 1.1
    factors.push(['Weight', 'Over 25 kg', 1.1])
  }

  return {
    age,
    riskFactor: Number(riskFactor.toFixed(3)),
    factors,
    plans: coveragePlans.map((plan) => {
      const monthlyPremium = roundPremium(plan.basePremium * riskFactor)
      return {
        ...plan,
        monthlyPremium,
        annualPremium: roundPremium(monthlyPremium * 12 * 0.9),
      }
    }),
  }
}
