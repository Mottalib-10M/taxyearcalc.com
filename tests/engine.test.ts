/**
 * Engine tests. Each reference value is printed in an IRS document or follows line by line from an IRS
 * form; the source is named on the test. A deviation fails the build (RECETTE §4, §17.4 point 5).
 */
import { describe, expect, it } from 'vitest';
import P from '../src/data/params-2026.json';
import {
  incomeTax, bracketBases, standardDeduction, tipsDeduction, overtimeDeduction, overtimePremium, carLoanDeduction,
  seniorDeduction, saltDeduction, capitalGainsTax, niit, childTaxCredit, eitc, amt, studentLoanInterest, charity,
  mortgageInterest, k401Limit, rothLimit, iraDeduction, hsaLimit, fica, excessSocialSecurity, giftTax, estateTax,
  section179, latePenalties, underpaymentInterest, estimatedTax, fullReturn, refundDate, STATUSES, type Year,
} from '../src/lib/engine/tax';

describe('rate schedules (Rev. Proc. 2025-32 §4.01, Rev. Proc. 2024-40 §2.01)', () => {
  for (const year of [2025, 2026] as Year[]) {
    for (const s of STATUSES) {
      it(`${year} ${s}: tax at the start of the 37% bracket equals the printed amount`, () => {
        const bases = bracketBases(year, s);
        expect(bases[6]).toBeCloseTo((P.years as any)[year].bracketCheck[s], 2);
      });
    }
  }
  it('2026 single, printed intermediate bases: $1,240 / $5,800 / $17,966 / $41,024 / $58,448', () => {
    expect(bracketBases(2026, 'single').slice(1, 6)).toEqual([1240, 5800, 17966, 41024, 58448]);
  });
  it('2026 married filing jointly: $2,480 / $11,600 / $35,932 / $82,048 / $116,896', () => {
    expect(bracketBases(2026, 'mfj').slice(1, 6)).toEqual([2480, 11600, 35932, 82048, 116896]);
  });
  it('2026 head of household: $1,770 / $7,740 / $16,155 / $39,207 / $56,631', () => {
    expect(bracketBases(2026, 'hoh').slice(1, 6)).toEqual([1770, 7740, 16155, 39207, 56631]);
  });
  it('2025 single: $1,192.50 / $5,578.50 / $17,651 / $40,199 / $57,231', () => {
    expect(bracketBases(2025, 'single').slice(1, 6)).toEqual([1192.5, 5578.5, 17651, 40199, 57231]);
  });
  it('marginal and average rate at $60,000 taxable, single 2026', () => {
    const r = incomeTax(2026, 'single', 60000);
    expect(r.tax).toBeCloseTo(5800 + 0.22 * 9600, 6);
    expect(r.marginal).toBe(22);
    expect(r.nextAt).toBe(105700);
  });
  it('zero income: no tax, 10% marginal', () => {
    const r = incomeTax(2026, 'mfj', 0); expect(r.tax).toBe(0); expect(r.marginal).toBe(10);
  });
});

describe('standard deduction (Rev. Proc. 2025-32 §3.01 and §4.14, Form 1040-ES 2026 chart)', () => {
  it('2026 amounts', () => {
    expect(standardDeduction(2026, 'single').total).toBe(16100);
    expect(standardDeduction(2026, 'mfj').total).toBe(32200);
    expect(standardDeduction(2026, 'hoh').total).toBe(24150);
  });
  it('2025 amounts as raised by P.L. 119-21', () => {
    expect(standardDeduction(2025, 'single').total).toBe(15750);
    expect(standardDeduction(2025, 'mfj').total).toBe(31500);
    expect(standardDeduction(2025, 'hoh').total).toBe(23625);
  });
  it('1040-ES 2026: unmarried 65 and blind adds $4,100; both spouses 65 and blind add $6,600', () => {
    expect(standardDeduction(2026, 'single', { age65: 1, blind: 1 }).additional).toBe(4100);
    expect(standardDeduction(2026, 'mfj', { age65: 2, blind: 2 }).additional).toBe(6600);
  });
  it('dependent: greater of $1,350 or earned income + $450, capped at the basic amount', () => {
    expect(standardDeduction(2026, 'single', { dependent: true, earned: 500 }).basic).toBe(1350);
    expect(standardDeduction(2026, 'single', { dependent: true, earned: 4000 }).basic).toBe(4450);
    expect(standardDeduction(2026, 'single', { dependent: true, earned: 40000 }).basic).toBe(16100);
  });
});

describe('Schedule 1-A 2025 (tips, overtime, car loan interest, seniors)', () => {
  it('tips: $18,000 under the threshold (Notice 2025-69, Ann)', () => {
    expect(tipsDeduction(2025, 'single', 18000, 60000).deduction).toBe(18000);
  });
  it('tips: capped at $25,000', () => {
    expect(tipsDeduction(2026, 'mfj', 31000, 120000).deduction).toBe(25000);
  });
  it('tips: line 11 rounds DOWN, $100 per full $1,000 (MAGI $160,500 → 10 steps)', () => {
    expect(tipsDeduction(2026, 'single', 20000, 160500).deduction).toBe(19000);
  });
  it('tips: married filing separately cannot claim', () => {
    expect(tipsDeduction(2026, 'mfs', 20000, 50000).deduction).toBe(0);
  });
  it('tips: the $25,000 maximum is gone at $400,000 MAGI for a single filer', () => {
    expect(tipsDeduction(2026, 'single', 25000, 400000).deduction).toBe(0);
    expect(tipsDeduction(2026, 'single', 25000, 399999).deduction).toBe(100);
  });
  it('overtime premium (IR-2025-114): 1.5x pay $15,000 → $5,000; 2x pay $20,000 → $5,000; comp time $4,500 → $1,500', () => {
    expect(overtimePremium(15000, 1.5)).toBeCloseTo(5000, 6);
    expect(overtimePremium(20000, 2)).toBeCloseTo(5000, 6);
    expect(overtimePremium(4500, 1.5)).toBeCloseTo(1500, 6);
  });
  it('overtime: $12,500 single / $25,000 joint caps', () => {
    expect(overtimeDeduction(2026, 'single', 14000, 90000).deduction).toBe(12500);
    expect(overtimeDeduction(2026, 'mfj', 30000, 200000).deduction).toBe(25000);
    expect(overtimeDeduction(2026, 'mfj', 30000, 310000).deduction).toBe(24000);
  });
  it('car loan interest: line 28 rounds UP, $200 per $1,000 (MAGI $100,001 → $200 off)', () => {
    expect(carLoanDeduction(2026, 'single', 3000, 100001).deduction).toBe(2800);
    expect(carLoanDeduction(2026, 'single', 12000, 90000).deduction).toBe(10000);
    expect(carLoanDeduction(2026, 'mfj', 5000, 225000).deduction).toBe(0);
  });
  it('seniors: 6% of MAGI over $75,000 / $150,000, per person', () => {
    expect(seniorDeduction(2026, 'single', 70000, 1).deduction).toBe(6000);
    expect(seniorDeduction(2026, 'single', 85000, 1).deduction).toBe(5400);
    expect(seniorDeduction(2026, 'mfj', 170000, 2).deduction).toBe(9600);
    expect(seniorDeduction(2026, 'single', 175000, 1).deduction).toBe(0);
    expect(seniorDeduction(2026, 'single', 175000, 1).gone).toBe(175000);
  });
});

describe('SALT cap (Schedule A 2025 worksheet; P.L. 119-21 §70120 for 2026)', () => {
  it('2025 under $500,000: $40,000 cap', () => {
    expect(saltDeduction(2025, 'mfj', 52000, 400000).deduction).toBe(40000);
  });
  it('2025 worksheet: MAGI $550,000 → $40,000 − 30% × $50,000 = $25,000', () => {
    expect(saltDeduction(2025, 'single', 52000, 550000).deduction).toBe(25000);
  });
  it('2025: never below $10,000 (MAGI $700,000)', () => {
    expect(saltDeduction(2025, 'single', 52000, 700000).deduction).toBe(10000);
  });
  it('2026: $40,400 cap and $505,000 threshold', () => {
    expect(saltDeduction(2026, 'mfj', 60000, 505000).deduction).toBe(40400);
    expect(saltDeduction(2026, 'mfj', 60000, 555000).deduction).toBe(25400);
  });
  it('married filing separately: half', () => {
    expect(saltDeduction(2026, 'mfs', 30000, 100000).deduction).toBe(20200);
  });
});

describe('capital gains (Rev. Proc. 2025-32 §4.03)', () => {
  it('single 2026: $40,000 ordinary + $20,000 gains → $9,450 at 0%, $10,550 at 15%', () => {
    const r = capitalGainsTax(2026, 'single', 40000, 20000);
    expect(r.at0).toBe(9450); expect(r.at15).toBe(10550); expect(r.tax).toBeCloseTo(1582.5, 6);
  });
  it('mfj 2026: gains above $613,700 at 20%', () => {
    const r = capitalGainsTax(2026, 'mfj', 600000, 100000);
    expect(r.at15).toBe(13700); expect(r.at20).toBe(86300);
  });
  it('NIIT: 3.8% of the lesser of NII and MAGI over $200,000', () => {
    expect(niit('single', 230000, 50000).tax).toBeCloseTo(1140, 6);
  });
});

describe('credits', () => {
  it('CTC: 2 children, $80,000 AGI, enough tax → $4,400 nonrefundable', () => {
    const c = childTaxCredit(2026, 'mfj', 2, 80000, 6000, 80000);
    expect(c.nonrefundable).toBe(4400); expect(c.refundable).toBe(0);
  });
  it('CTC: phase-out $50 per $1,000 or fraction over $400,000 joint (AGI $410,500 → $550)', () => {
    expect(childTaxCredit(2026, 'mfj', 1, 410500, 50000, 410500).reduction).toBe(550);
  });
  it('ACTC: 15% of earned income over $2,500, $1,700 a child', () => {
    const c = childTaxCredit(2026, 'hoh', 2, 20000, 0, 20000);
    expect(c.refundable).toBeCloseTo(2625, 6);
    const d = childTaxCredit(2026, 'hoh', 2, 40000, 0, 40000);
    expect(d.refundable).toBe(3400);
  });
  it('EITC 2026: maximum credits and complete phase-out amounts', () => {
    expect(eitc(2026, 3, 30000, 30000, true).credit).toBe(8231);
    expect(eitc(2026, 1, 13020, 13020, false).credit).toBeCloseTo(4427, 6);
    expect(eitc(2026, 1, 51593, 51593, false).credit).toBeCloseTo(0, 6);
    expect(eitc(2026, 0, 20000, 20000, false).credit).toBe(0);
    expect(eitc(2026, 2, 30000, 30000, false, 12201).credit).toBe(0);
  });
  it('EITC 2025: $8,046 maximum with three children', () => {
    expect(eitc(2025, 3, 25000, 25000, true).credit).toBe(8046);
  });
});

describe('AMT 2026 (§55 as amended, 50% phase-out)', () => {
  it('exemption intact under $500,000; reduced by half the excess', () => {
    expect(amt(2026, 'single', 300000).exemption).toBe(90100);
    expect(amt(2026, 'single', 600000).exemption).toBe(40100);
    expect(amt(2026, 'single', 680200).exemption).toBe(0);
    expect(amt(2025, 'single', 978750).exemption).toBe(0);
  });
});

describe('other deductions', () => {
  it('student loan interest: halfway through the 2026 single range → $1,250', () => {
    expect(studentLoanInterest(2026, 'single', 3000, 92500).deduction).toBe(1250);
  });
  it('2026 charity: $1,000 non-itemizer cap, 0.5% floor', () => {
    const c = charity(2026, 'single', 1500, 80000);
    expect(c.nonItemizer).toBe(1000); expect(c.floor).toBe(400); expect(c.itemized).toBe(1100);
  });
  it('2025 charity: no non-itemizer deduction, no floor', () => {
    const c = charity(2025, 'mfj', 1500, 80000); expect(c.nonItemizer).toBe(0); expect(c.itemized).toBe(1500);
  });
  it('mortgage: $1,000,000 balance → 75% of the interest', () => {
    expect(mortgageInterest('mfj', 1000000, 60000, false).deductible).toBe(45000);
    expect(mortgageInterest('mfj', 1000000, 60000, true).deductible).toBe(60000);
  });
});

describe('accounts (Notice 2025-67, Rev. Proc. 2025-19)', () => {
  it('401(k): $24,500; $32,500 at 50; $35,750 at 60 to 63; $32,500 at 64', () => {
    expect(k401Limit(2026, 40).total).toBe(24500);
    expect(k401Limit(2026, 55).total).toBe(32500);
    expect(k401Limit(2026, 61).total).toBe(35750);
    expect(k401Limit(2026, 64).total).toBe(32500);
  });
  it('Roth IRA: full under $153,000 single, $0 at $168,000, rounded up to $10, $200 floor', () => {
    expect(rothLimit('single', 150000, 30).limit).toBe(7500);
    expect(rothLimit('single', 168000, 30).limit).toBe(0);
    expect(rothLimit('single', 160500, 30).limit).toBe(3750);
    expect(rothLimit('single', 167800, 30).limit).toBe(200);
    expect(rothLimit('mfj', 247000, 55).limit).toBe(4300);
  });
  it('traditional IRA deduction when covered: $81,000 to $91,000 single', () => {
    expect(iraDeduction('single', 86000, 40, true, false).limit).toBe(3750);
    expect(iraDeduction('single', 200000, 40, false, false).limit).toBe(7500);
  });
  it('HSA: $4,400 self, $8,750 family, + $1,000 at 55, prorated by month', () => {
    expect(hsaLimit(false, 40, 12).limit).toBe(4400);
    expect(hsaLimit(true, 56, 12).limit).toBe(9750);
    expect(hsaLimit(false, 40, 6).limit).toBe(2200);
  });
});

describe('payroll and transfer taxes', () => {
  it('FICA on $200,000 single: social security capped at $184,500', () => {
    const f = fica('single', 200000, false);
    expect(f.ss).toBeCloseTo(11439, 6); expect(f.medicare).toBeCloseTo(2900, 6); expect(f.additional).toBe(0);
  });
  it('Additional Medicare: 0.9% over $200,000', () => {
    expect(fica('single', 300000, false).additional).toBeCloseTo(900, 6);
  });
  it('excess social security with two employers', () => {
    expect(excessSocialSecurity([120000, 100000]).excess).toBeCloseTo(35500 * 0.062, 6);
  });
  it('gift: $19,000 per recipient, $38,000 when split', () => {
    expect(giftTax(2026, [30000, 10000], false).taxable).toBe(11000);
    expect(giftTax(2026, [30000], true).taxable).toBe(0);
  });
  it('estate 2026: 40% above $15,000,000', () => {
    expect(estateTax(2026, 16000000).tax).toBe(400000);
    expect(estateTax(2025, 16000000).tax).toBeCloseTo(804000, 6);
  });
  it('section 179 2026: limit falls dollar for dollar above $4,090,000', () => {
    expect(section179(2026, 3000000, 3000000).expensed).toBe(2560000);
    expect(section179(2026, 3000000, 5000000).limit).toBe(1650000);
  });
});

describe('deadlines, penalties, interest', () => {
  it('late filing 3 months with tax unpaid: 4.5% + 0.5% a month', () => {
    const p = latePenalties(2026, 10000, 3, 3);
    expect(p.ftf).toBeCloseTo(1350, 6); expect(p.ftp).toBeCloseTo(150, 6);
  });
  it('more than 60 days late with a small balance: minimum penalty, at most 100% of the tax', () => {
    expect(latePenalties(2026, 300, 3, 3).ftf).toBe(300);
    expect(latePenalties(2026, 3000, 3, 0).ftf).toBe(535);
    expect(latePenalties(2025, 3000, 3, 0).ftf).toBe(525);
  });
  it('interest compounds daily', () => {
    expect(underpaymentInterest(10000, 365, 7)).toBeCloseTo(725.01, 1);
  });
  it('estimated tax: 110% rule above $150,000 of prior AGI', () => {
    const e = estimatedTax(40000, 30000, 160000, 10000);
    expect(e.required).toBe(33000); expect(e.toPay).toBe(23000);
    expect(estimatedTax(10000, 9000, 50000, 9500).toPay).toBe(0);
  });
});

describe('whole return', () => {
  it('single 2026, $60,000 wages, standard deduction, $6,000 withheld', () => {
    const r = fullReturn({ year: 2026, status: 'single', wages: 60000, otherIncome: 0, adjustments: 0, itemized: 0, age65: 0, kids: 0, tips: 0, overtimePremium: 0, withholding: 6000 });
    expect(r.taxable).toBe(43900);
    expect(r.taxBefore).toBeCloseTo(1240 + 0.12 * (43900 - 12400), 6);
    expect(r.refund).toBeCloseTo(6000 - 5020, 6);
  });
  it('tips reduce taxable income below the line, not AGI', () => {
    const r = fullReturn({ year: 2025, status: 'single', wages: 30000, otherIncome: 0, adjustments: 0, itemized: 0, age65: 0, kids: 0, tips: 18000, overtimePremium: 0, withholding: 0 });
    expect(r.agi).toBe(30000); expect(r.tips).toBe(18000); expect(r.taxable).toBe(0);
  });
});

describe('refund timing', () => {
  it('e-file on February 2, 2026 with direct deposit: about February 23', () => {
    expect(refundDate('2026-02-02', true, false, true).date).toBe('2026-02-23');
  });
  it('EITC return e-filed January 26, 2026: March 2, 2026', () => {
    expect(refundDate('2026-01-26', true, true, true).date).toBe('2026-03-02');
  });
  it('paper return: six weeks', () => {
    expect(refundDate('2026-03-01', false, false, true).date).toBe('2026-04-12');
  });
});

import { dependentCareRate, dependentCareCredit, adoptionCredit, kiddieTax, feie, qbiDeduction } from '../src/lib/engine/tax';
describe('credits and exclusions added by P.L. 119-21 and Rev. Proc. 2025-32', () => {
  it('dependent care rate 2026 (§21(a)(2) as amended)', () => {
    expect(dependentCareRate(2026, 'single', 15000)).toBe(50);
    expect(dependentCareRate(2026, 'single', 15001)).toBe(49);
    expect(dependentCareRate(2026, 'single', 60000)).toBe(35);
    expect(dependentCareRate(2026, 'single', 79000)).toBe(33);
    expect(dependentCareRate(2026, 'mfj', 120000)).toBe(35);
    expect(dependentCareRate(2026, 'mfj', 158000)).toBe(33);
    expect(dependentCareRate(2026, 'single', 500000)).toBe(20);
    expect(dependentCareRate(2025, 'mfj', 60000)).toBe(20);
    expect(dependentCareRate(2025, 'mfj', 20000)).toBe(32);
  });
  it('dependent care credit: $6,000 cap for two children', () => {
    expect(dependentCareCredit(2026, 'mfj', 100000, 9000, 2).credit).toBe(2100);
  });
  it('adoption credit 2026: $17,670, phased out from $265,080 to $305,080, $5,120 refundable', () => {
    expect(adoptionCredit(2026, 20000, 100000).credit).toBe(17670);
    expect(adoptionCredit(2026, 20000, 285080).credit).toBeCloseTo(8835, 6);
    expect(adoptionCredit(2026, 20000, 100000).refundable).toBe(5120);
  });
  it('kiddie tax: $1,350 free, $1,350 at 10%, the rest at the parents rate', () => {
    expect(kiddieTax(2026, 5000, 24).tax).toBeCloseTo(135 + 2300 * 0.24, 6);
  });
  it('FEIE 2026: $132,900 for a full year, stacking rule', () => {
    const f = feie(2026, 'single', 150000, 0, 365);
    expect(f.excluded).toBe(132900);
    expect(f.taxableAfter).toBe(1000);
    expect(f.tax).toBeCloseTo(incomeTax(2026, 'single', 133900).tax - incomeTax(2026, 'single', 132900).tax, 6);
  });
  it('QBI 2026: 20% of QBI, limited to 20% of taxable income, $400 minimum', () => {
    expect(qbiDeduction(2026, 'single', 50000, 100000).deduction).toBe(10000);
    expect(qbiDeduction(2026, 'single', 50000, 30000).deduction).toBe(6000);
    expect(qbiDeduction(2026, 'single', 1500, 60000).deduction).toBe(400);
  });
});
