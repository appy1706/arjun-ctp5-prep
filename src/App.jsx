import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";

/* ============================================================
   Arjun's CTP 5 Prep: 14-day study plan, lessons, quizzes,
   flashcards and two full-length hard practice tests.
   All questions are original and modeled on CTP 5 subtest types.
   ============================================================ */

const Q = (q, o, a, e, tag) => ({ q, o, a, e, tag });
const P = (x) => ({ t: "p", x });
const H = (x) => ({ t: "h", x });
const L = (x) => ({ t: "l", x });
const EX = (q, s) => ({ t: "ex", q, s });
const TIP = (x) => ({ t: "tip", x });
const TRAP = (x) => ({ t: "trap", x });

const MOD_V = {
  id: "V", name: "Verbal Reasoning", blurb: "Analogies, odd-one-out, and logic", color: "#5b3df5",
  lessons: [
    { id: "V1", title: "Analogies: name the relationship", min: 12, blocks: [
      P(`An analogy asks you to find the relationship in the first pair of words, then match it in the second pair. The goal is not to find words that are merely "related." The goal is to name the exact relationship.`),
      H(`Three steps`),
      L([
        `Make a bridge sentence for the first pair: "A ___ is a ___ that ___." For example, a chisel is a tool used to shape stone.`,
        `Put the third word into the same sentence and test every answer choice.`,
        `If two choices fit, your sentence is too vague. Make it more specific and test again.`,
      ]),
      H(`Relationships to know`),
      L([
        `Synonym or antonym (frugal : thrifty, frugal : wasteful)`,
        `Degree or intensity (drizzle : downpour, warm : scorching)`,
        `Part to whole (page : book)`,
        `Tool to purpose, or worker to tool (scalpel : surgeon)`,
        `Cause and effect (spark : fire)`,
        `Category to member (reptile : lizard)`,
        `Creator to product (architect : blueprint)`,
        `Characteristic action (brittle : shatter)`,
        `Lack of (drought : water)`,
      ]),
      EX(`Lull : storm :: intermission : ___ (A. theater  B. performance  C. ticket  D. applause)`, `Bridge sentence: a lull is a pause in a storm. An intermission is a pause in a performance. Answer: B. "Theater" is related, but a theater is a place and not the thing being paused.`),
      TRAP(`Wrong answers are usually "same topic" words (theater, ticket). Always test the bridge sentence instead of trusting a gut feeling.`),
    ]},
    { id: "V2", title: "Classification and odd-one-out", min: 10, blocks: [
      P(`To find the word that does not belong, find the narrowest category that fits three of the four words. If you can't finish the sentence "Three of these are ___," try a different category.`),
      H(`Categories to try`),
      L([
        `Type of thing (all poems, all tools, all mammals)`,
        `What is measured (length vs area vs volume vs mass)`,
        `Part of speech or word form`,
        `Degree (warm, hot, scorching vs. chilly)`,
        `Function or purpose`,
      ]),
      EX(`Which does NOT belong: kilometer, hectare, fathom, furlong?`, `Kilometer, fathom, and furlong all measure length. A hectare measures area. The category is "units of length."`),
      TIP(`The odd word is often a close relative of the others, so a loose category ("units of measure") will fail. Make the category tighter.`),
    ]},
    { id: "V3", title: "Logical reasoning", min: 13, blocks: [
      P(`"Must be true" questions use only the facts given. If a statement could be false while every fact stays true, it is not a must-be-true statement.`),
      H(`Four tools`),
      L([
        `"All A are B" puts A inside B. It does NOT mean all B are A.`,
        `"Some A are B" means at least one overlaps. It tells you nothing about the rest of A.`,
        `If P then Q: when P is true, Q is true. When Q is false, P must be false (the contrapositive). But Q being true says nothing about P, and P being false says nothing about Q.`,
        `Ordering puzzles: draw a line, place names as you read, and add each clue one at a time.`,
      ]),
      EX(`All pilots at the airline passed the exam. Rosa did not pass the exam. What must be true?`, `If Rosa were a pilot at the airline, she would have passed. So Rosa is not a pilot at the airline. That is the contrapositive.`),
      TRAP(`Reversing the statement. "If it rains, the game is canceled" does NOT mean "if the game is canceled, it rained."`),
    ]},
  ],
  quiz: [
    Q(`Architect : blueprint :: composer : ___`, [`concert`, `score`, `orchestra`, `melody`], 1, `An architect creates a blueprint (the written plan). A composer creates a score (the written music). Concert and orchestra are performance words, and a melody is only one part of a score.`),
    Q(`Spark : fire :: seed : ___`, [`garden`, `soil`, `plant`, `water`], 2, `A spark can start a fire, and a seed can grow into a plant. This is cause and effect (or "beginning to result").`),
    Q(`Meticulous : sloppy :: frugal : ___`, [`thrifty`, `wasteful`, `poor`, `careful`], 1, `These are antonym pairs. Meticulous means very careful and sloppy is its opposite. Frugal means careful with money, and its opposite is wasteful.`),
    Q(`Which word does NOT belong? canyon, valley, ravine, plateau`, [`canyon`, `valley`, `ravine`, `plateau`], 3, `Canyons, valleys, and ravines are low areas carved between higher land. A plateau is high, flat land.`),
    Q(`Given: "Some dolphins are mammals." "All mammals breathe air." Which MUST be true?`, [`All dolphins breathe air.`, `Some dolphins breathe air.`, `Dolphins are the only mammals that breathe air.`, `Some mammals are not dolphins.`], 1, `The dolphins that are mammals must breathe air, so some dolphins breathe air. The other statements go beyond the given facts.`),
    Q(`"If a shape is a square, then it has four equal sides." Which statement MUST be true?`, [`If a shape has four equal sides, it is a square.`, `If a shape does not have four equal sides, it is not a square.`, `Every four-sided shape is a square.`, `If a shape is not a square, it does not have four equal sides.`], 1, `That is the contrapositive of the original statement, so it must be true. The first and last are the converse and the inverse, which can fail (a rhombus has four equal sides but is not necessarily a square).`),
    Q(`Priya finished before Tomas. Quinn finished after Tomas. Ravi finished before Priya but after Sam. Who finished second?`, [`Priya`, `Ravi`, `Tomas`, `Sam`], 1, `The order is Sam, Ravi, Priya, Tomas, Quinn. Ravi is second.`),
    Q(`The senator's speech was so ______ that listeners, expecting a brief address, began checking their watches after an hour.`, [`concise`, `interminable`, `eloquent`, `hostile`], 1, `"Interminable" means seeming to go on forever, which fits a speech that was expected to be brief but ran over an hour.`),
  ],
};

const MOD_Q = {
  id: "Q", name: "Quantitative Reasoning", blurb: "Patterns, number relationships, puzzles", color: "#0e8f84",
  lessons: [
    { id: "Q1", title: "Number patterns", min: 12, blocks: [
      P(`Pattern questions test whether you can find the rule. Use a method instead of guessing.`),
      H(`Method`),
      L([
        `Find the differences between neighbors. A constant difference means an arithmetic pattern.`,
        `If the differences are not constant, find the differences of the differences. Differences that grow by 1, 2, 3 (or double) point to a growing-difference pattern.`,
        `Check ratios. A constant multiplier means a geometric pattern.`,
        `Try a two-step rule such as "double and add 1."`,
        `If the pattern seems to jump around, split it into two interleaved patterns (odd positions and even positions).`,
      ]),
      H(`Sequences worth recognizing`),
      L([`Squares: 1, 4, 9, 16, 25, 36`, `Cubes: 1, 8, 27, 64, 125`, `Triangular numbers: 1, 3, 6, 10, 15, 21`, `Powers of 2: 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024`, `Fibonacci: each term is the sum of the two before it (1, 1, 2, 3, 5, 8, 13, 21)`]),
      EX(`2, 5, 11, 23, 47, ___`, `Differences are 3, 6, 12, 24, doubling each time, so the next difference is 48 and the next term is 95. Equivalent rule: double and add 1.`),
    ]},
    { id: "Q2", title: "Comparing quantities", min: 10, blocks: [
      P(`When a question asks which quantity is greater, you often do not need exact values. Convert to a common form, estimate, or test a few smart numbers.`),
      L([
        `With variables, test 0, 1, a fraction between 0 and 1, and a negative number. If the answer changes, the correct choice is "cannot be determined."`,
        `For a number x between 0 and 1: x² < x < √x < 1/x.`,
        `Know your powers: 2^10 = 1,024, 3^4 = 81, 4^3 = 64.`,
        `Compare fractions by converting to decimals or cross-multiplying.`,
      ]),
      EX(`Which is greater: 2^10 or 10^3?`, `2^10 = 1,024 and 10^3 = 1,000, so 2^10 is greater. A strong memory for powers of 2 saves time.`),
      TRAP(`"If x > 0, which is greater, x or x²?" Try x = 0.5 (x is greater) and x = 2 (x² is greater). The answer is "cannot be determined."`),
    ]},
    { id: "Q3", title: "Working backward and function rules", min: 10, blocks: [
      P(`When the final result is given and the starting number is missing, undo each step in reverse order.`),
      EX(`A number is tripled, then 8 is subtracted, then the result is halved, giving 11. What was the number?`, `Work backward: 11 × 2 = 22, then 22 + 8 = 30, then 30 ÷ 3 = 10.`),
      H(`Function rules`),
      L([
        `A rule like output = 3n − 4 can be run forward (plug in n) or backward (set output equal to a value and solve).`,
        `Sum and difference puzzle: if two numbers have sum S and difference D, the numbers are (S + D) ÷ 2 and (S − D) ÷ 2.`,
        `Consecutive numbers: write them as n, n + 1, n + 2. Consecutive even or odd numbers: n, n + 2, n + 4.`,
      ]),
      TIP(`Always check your answer by running the steps forward.`),
    ]},
  ],
  quiz: [
    Q(`2, 6, 12, 20, 30, ___`, [`40`, `42`, `44`, `36`], 1, `Differences are 4, 6, 8, 10, so the next difference is 12. 30 + 12 = 42.`),
    Q(`1, 1, 2, 3, 5, 8, 13, ___`, [`18`, `20`, `21`, `26`], 2, `Each term is the sum of the previous two (Fibonacci). 8 + 13 = 21.`),
    Q(`2, 5, 11, 23, 47, ___`, [`71`, `93`, `95`, `94`], 2, `Double and add 1: 47 × 2 + 1 = 95.`),
    Q(`4, 3, 8, 6, 12, 9, 16, ___`, [`10`, `12`, `18`, `20`], 1, `Two interleaved patterns: 4, 8, 12, 16 (add 4) and 3, 6, 9, next 12 (add 3).`),
    Q(`If x > 0, which is greater: x or x²?`, [`x`, `x²`, `They are always equal`, `It cannot be determined`], 3, `For x = 0.5, x is greater. For x = 2, x² is greater. The answer depends on x.`),
    Q(`A rule changes n into 3n − 4. For which n is the output 20?`, [`6`, `7`, `8`, `9`], 2, `3n − 4 = 20 → 3n = 24 → n = 8.`),
    Q(`A number is multiplied by 4, and then 6 is added. The result equals 3 times the original number plus 9. What is the number?`, [`1`, `2`, `3`, `4`], 2, `4n + 6 = 3n + 9 → n = 3. Check: 4(3) + 6 = 18 and 3(3) + 9 = 18.`),
    Q(`Figure 1 has 3 dots, Figure 2 has 7, Figure 3 has 13, and Figure 4 has 21. How many dots are in Figure 6?`, [`37`, `43`, `45`, `49`], 1, `Differences are 4, 6, 8, so the next are 10 and 12. Figure 5 has 31 and Figure 6 has 43. (Formula: n² + n + 1.)`),
  ],
};

const MOD_N = {
  id: "N", name: "Fractions, Ratios and Percents", blurb: "Number sense and operations", color: "#d9480f",
  lessons: [
    { id: "N1", title: "Fractions and decimals", min: 15, blocks: [
      H(`Fractions`),
      L([
        `Add or subtract: use a common denominator. 5/6 − 3/8 = 20/24 − 9/24 = 11/24.`,
        `Multiply: top times top and bottom times bottom. Simplify first by canceling.`,
        `Divide: keep, change, flip (multiply by the reciprocal). Change mixed numbers to improper fractions first.`,
      ]),
      H(`Decimals`),
      L([
        `Add or subtract by lining up the decimal points.`,
        `Multiply as if there were no decimals, then count the decimal places in both factors.`,
        `Divide by shifting both decimal points the same number of places until the divisor is whole: 4.2 ÷ 0.07 = 420 ÷ 7 = 60.`,
      ]),
      EX(`2 3/4 ÷ 1 1/8 = ?`, `Change to improper fractions: 11/4 ÷ 9/8 = 11/4 × 8/9 = 88/36 = 22/9 = 2 4/9.`),
      TIP(`To order fractions and decimals, convert everything to decimals. 7/12 ≈ 0.583, 5/9 ≈ 0.556, 3/5 = 0.6.`),
    ]},
    { id: "N2", title: "Ratios, rates and proportions", min: 15, blocks: [
      L([
        `A part-to-part ratio (red : blue) is not a part-to-whole ratio (red : total). Read carefully.`,
        `The "parts" method: add the ratio numbers to get total parts, find the value of one part, then multiply.`,
        `A unit rate is a ratio with 1 in the denominator (miles per hour, price per ounce).`,
        `Proportions: use a ratio table or cross-multiply. 3 cups flour per 2 cups sugar, 7.5 cups flour needs 7.5 ÷ 3 × 2 = 5 cups sugar.`,
      ]),
      EX(`The ratio of red to blue marbles is 3 : 5. There are 24 more blue than red. How many red marbles are there?`, `The difference is 5 − 3 = 2 parts, and 2 parts = 24, so 1 part = 12. Red = 3 × 12 = 36.`),
      TRAP(`Using the difference when the problem gives the total (or the reverse). Underline which number the problem gives.`),
    ]},
    { id: "N3", title: "Percents", min: 15, blocks: [
      L([
        `Percent means "per 100." Convert: 35% = 0.35 = 35/100.`,
        `Part = percent × whole. To find the whole, divide the part by the percent: 27 ÷ 0.15 = 180.`,
        `Percent change = (new − old) ÷ old × 100.`,
        `Successive percents multiply: two discounts of 20% then 25% leave 0.80 × 0.75 = 0.60 of the price, a 40% total discount, not 45%.`,
        `Benchmarks: 10% (move the decimal), 50% (half), 25% (quarter), 12.5% (one-eighth).`,
      ]),
      EX(`A price rises from $40 to $52. What is the percent increase?`, `Change = 12. 12 ÷ 40 = 0.30, so a 30% increase (based on the original price).`),
      TRAP(`An increase of 20% followed by a decrease of 20% does not return to the start: 1.2 × 0.8 = 0.96, a net 4% drop.`),
    ]},
    { id: "N4", title: "Factors, multiples and exponents", min: 15, blocks: [
      L([
        `Prime factorization: break a number into primes. 360 = 2³ × 3² × 5.`,
        `GCF: multiply the primes the numbers share (lowest powers). LCM: multiply all primes (highest powers).`,
        `Divisibility: by 3 if the digit sum is divisible by 3; by 4 if the last two digits are; by 9 if the digit sum is divisible by 9.`,
        `An exponent counts repeated multiplication: 2⁵ = 2 × 2 × 2 × 2 × 2 = 32.`,
      ]),
      EX(`What is the LCM of 12 and 18?`, `12 = 2² × 3 and 18 = 2 × 3². Take the highest powers: 2² × 3² = 36.`),
      TIP(`GCF is for splitting into equal groups. LCM is for when things line up again (schedules, repeating events).`),
    ]},
  ],
  quiz: [
    Q(`What is 2 3/4 ÷ 1 1/8?`, [`3 3/32`, `2 4/9`, `1 5/8`, `2 1/3`], 1, `11/4 ÷ 9/8 = 11/4 × 8/9 = 22/9 = 2 4/9. Choice A is what you get by multiplying instead of dividing.`),
    Q(`What is 4.2 ÷ 0.07?`, [`6`, `0.6`, `60`, `600`], 2, `Shift both decimals two places: 420 ÷ 7 = 60.`),
    Q(`Which lists the numbers from least to greatest? 7/12, 0.58, 3/5, 5/9`, [`5/9, 0.58, 7/12, 3/5`, `0.58, 5/9, 7/12, 3/5`, `5/9, 7/12, 0.58, 3/5`, `3/5, 7/12, 0.58, 5/9`], 0, `As decimals: 5/9 ≈ 0.556, 0.58, 7/12 ≈ 0.583, 3/5 = 0.6.`),
    Q(`The ratio of red to blue marbles is 3 : 5. There are 24 more blue marbles than red. How many red marbles are there?`, [`24`, `36`, `60`, `12`], 1, `The difference of 2 parts equals 24, so 1 part is 12. Red = 3 × 12 = 36.`),
    Q(`A car travels 150 miles in 2.5 hours. At the same speed, how long will 270 miles take?`, [`4 hours`, `4.5 hours`, `5 hours`, `4 hours 15 minutes`], 1, `Speed = 150 ÷ 2.5 = 60 mph. 270 ÷ 60 = 4.5 hours.`),
    Q(`A store takes 20% off a jacket, then takes an additional 25% off the sale price. What is the total discount?`, [`45%`, `40%`, `35%`, `50%`], 1, `0.80 × 0.75 = 0.60, so you pay 60% of the original price, a 40% discount.`),
    Q(`A price rises from $40 to $52. What is the percent increase?`, [`12%`, `23%`, `30%`, `130%`], 2, `The increase is $12. 12 ÷ 40 = 0.30 = 30%.`),
    Q(`15% of a number is 27. What is the number?`, [`4.05`, `40.5`, `180`, `405`], 2, `27 ÷ 0.15 = 180.`),
    Q(`What is the least common multiple of 12 and 18?`, [`6`, `36`, `72`, `216`], 1, `Multiples of 18: 18, 36. 36 is the first multiple of 18 that 12 also divides into.`),
    Q(`Which is the prime factorization of 360?`, [`2³ × 3² × 5`, `2² × 3² × 10`, `2³ × 3 × 5²`, `2 × 3² × 5³`], 0, `8 × 9 × 5 = 360. Choice B contains 10, which is not prime, and the others do not multiply to 360.`),
  ],
};

const MOD_A = {
  id: "A", name: "Algebra and Equations", blurb: "Integers, expressions, equations, inequalities", color: "#7c3aed",
  lessons: [
    { id: "A1", title: "Integers and order of operations", min: 12, blocks: [
      L([
        `Adding a negative is subtracting. Subtracting a negative is adding: 5 − (−3) = 8.`,
        `A negative times a negative is positive. An even number of negatives gives a positive product.`,
        `Absolute value is distance from zero: |−7| = 7.`,
        `Order of operations: parentheses, exponents, then multiplication and division left to right, then addition and subtraction left to right.`,
      ]),
      EX(`Evaluate −2³ + (−4)² ÷ 8.`, `−2³ = −8. (−4)² = 16. 16 ÷ 8 = 2. Then −8 + 2 = −6.`),
      TRAP(`(−3)² = 9 but −3² = −9, because the exponent applies only to the 3 when there are no parentheses.`),
    ]},
    { id: "A2", title: "Expressions and the distributive property", min: 12, blocks: [
      L([
        `Distribute to every term inside: 4(2x − 3) = 8x − 12.`,
        `A minus sign in front of a parenthesis flips every sign inside: −2(x − 5) = −2x + 10.`,
        `Combine only like terms (same variable, same power).`,
        `Translating words: "5 less than the product of 3 and n" is 3n − 5. "Less than" reverses the order.`,
      ]),
      EX(`Simplify 4(2x − 3) − 2(x − 5).`, `8x − 12 − 2x + 10 = 6x − 2.`),
      TIP(`Write each distributed term on its own line before combining. Most sign errors happen when you do it all in your head.`),
    ]},
    { id: "A3", title: "Equations and inequalities", min: 16, blocks: [
      L([
        `Use inverse operations to isolate the variable, doing the same thing to both sides.`,
        `Variables on both sides: distribute first, collect variable terms on one side, then solve.`,
        `Word problems: define the variable first. "8 more than twice Maya's money" is 2x + 8.`,
        `Inequalities solve like equations. A solution is a whole set of numbers: 3x − 5 > 10 gives x > 5.`,
        `Always check your answer by substituting it back in.`,
      ]),
      EX(`Maya has x dollars. Jon has $8 more than twice Maya's amount. Together they have $53. How much does Maya have?`, `x + (2x + 8) = 53 → 3x + 8 = 53 → 3x = 45 → x = 15.`),
    ]},
  ],
  quiz: [
    Q(`What is the value of −2³ + (−4)² ÷ 8?`, [`−6`, `6`, `−10`, `10`], 0, `−2³ = −8, (−4)² = 16, and 16 ÷ 8 = 2. −8 + 2 = −6.`),
    Q(`Evaluate 2(x − 3) + 5x when x = 4.`, [`22`, `17`, `23`, `28`], 0, `2(1) + 5(4) = 2 + 20 = 22.`),
    Q(`Simplify 3(2x + 4) − 5x.`, [`x + 12`, `11x + 12`, `x + 4`, `6x + 7`], 0, `6x + 12 − 5x = x + 12.`),
    Q(`Solve 5x − 7 = 2x + 14.`, [`3`, `5`, `7`, `21`], 2, `3x = 21, so x = 7.`),
    Q(`Solve x/4 + 6 = 15.`, [`5.25`, `21`, `36`, `84`], 2, `x/4 = 9, so x = 36.`),
    Q(`Which value is a solution of 3x − 5 > 10?`, [`4`, `5`, `6`, `−5`], 2, `3x > 15, so x > 5. Only 6 works. (5 gives exactly 10, which is not greater.)`),
    Q(`Maya has x dollars. Jon has $8 more than twice Maya's amount. Together they have $53. How much does Maya have?`, [`$11`, `$15`, `$18`, `$45`], 1, `x + 2x + 8 = 53, so 3x = 45 and x = 15.`),
    Q(`Which expression means "5 less than the product of 3 and n"?`, [`5 − 3n`, `3n − 5`, `3(n − 5)`, `3 + n − 5`], 1, `The product of 3 and n is 3n. "5 less than" means subtract 5 from it: 3n − 5.`),
    Q(`Which expression is equivalent to 4(2x − 3) − 2(x − 5)?`, [`6x − 22`, `6x − 2`, `10x − 22`, `6x + 2`], 1, `8x − 12 − 2x + 10 = 6x − 2.`),
    Q(`What is |−7| − |3 − 8|?`, [`2`, `−2`, `12`, `15`], 0, `|−7| = 7 and |3 − 8| = |−5| = 5. 7 − 5 = 2.`),
  ],
};

const MOD_G = {
  id: "G", name: "Geometry and Measurement", blurb: "Area, angles, volume, units", color: "#c2410c",
  lessons: [
    { id: "G1", title: "Area, perimeter and circles", min: 12, blocks: [
      L([
        `Rectangle: A = l × w. Parallelogram: A = b × h. Triangle: A = ½ × b × h. Trapezoid: A = ½ × (b₁ + b₂) × h.`,
        `Circle: circumference C = 2πr, area A = πr². Use π ≈ 3.14 unless told otherwise.`,
        `Composite shapes: split into pieces and add, or subtract a missing piece from a larger rectangle.`,
        `Work backward from area or perimeter to find a missing side using algebra.`,
      ]),
      EX(`A trapezoid has bases 8 and 14 and height 5. What is its area?`, `½ × (8 + 14) × 5 = ½ × 22 × 5 = 55.`),
      TRAP(`Height is the perpendicular distance, not the slanted side.`),
    ]},
    { id: "G2", title: "Angles and triangles", min: 10, blocks: [
      L([
        `Angles in a triangle add to 180°. In a quadrilateral they add to 360°.`,
        `Supplementary angles add to 180° (a straight line). Complementary angles add to 90°. Vertical angles are equal.`,
        `Ratio problems: if angles are in ratio 2 : 3 : 4, the parts total 9, so 1 part = 180 ÷ 9 = 20°.`,
        `Isosceles triangles have two equal angles opposite the two equal sides.`,
      ]),
      EX(`The angles of a triangle are in the ratio 2 : 3 : 4. What is the largest angle?`, `2 + 3 + 4 = 9 parts, so 1 part = 20°. The largest angle is 4 × 20 = 80°.`),
    ]},
    { id: "G3", title: "Volume, surface area, units and coordinates", min: 13, blocks: [
      L([
        `Volume of a rectangular prism: V = l × w × h. Surface area: add the areas of all six faces.`,
        `If every dimension is multiplied by k, lengths scale by k, areas by k², and volumes by k³.`,
        `Conversions: 1 m = 100 cm, 1 L = 1,000 cm³, 1 km = 1,000 m.`,
        `On a coordinate grid, distance along a vertical or horizontal line is the difference of the coordinates that change.`,
        `Scale drawings: multiply the drawn length by the scale factor.`,
      ]),
      EX(`A box measures 6 × 5 × 4. If every dimension doubles, what happens to the volume?`, `The original volume is 120. Doubling every dimension multiplies volume by 2³ = 8, so the new volume is 960.`),
      TIP(`Always write units next to numbers. A wrong unit is a common reason for an answer that is "off by a lot."`),
    ]},
  ],
  quiz: [
    Q(`A trapezoid has bases of 8 and 14 and a height of 5. What is its area?`, [`110`, `55`, `40`, `70`], 1, `½ × (8 + 14) × 5 = 55.`),
    Q(`A 12 by 9 rectangle has a 3 by 4 rectangle cut out of one corner. What is the remaining area?`, [`96`, `108`, `120`, `84`], 0, `108 − 12 = 96.`),
    Q(`Two angles of a triangle measure 47° and 68°. What is the third angle?`, [`65°`, `75°`, `115°`, `85°`], 0, `47 + 68 = 115, and 180 − 115 = 65.`),
    Q(`Two supplementary angles measure (3x + 10)° and (2x + 20)°. What is the smaller angle?`, [`60°`, `80°`, `100°`, `30°`], 1, `5x + 30 = 180, so x = 30. The angles are 100° and 80°. The smaller is 80°.`),
    Q(`A rectangular prism measures 6 cm by 5 cm by 4 cm. If each dimension is doubled, what is the new volume?`, [`240 cm³`, `480 cm³`, `960 cm³`, `1,920 cm³`], 2, `Doubling each dimension multiplies volume by 8. 120 × 8 = 960.`),
    Q(`A circle has a circumference of 31.4 cm. Using π = 3.14, what is its area?`, [`31.4 cm²`, `78.5 cm²`, `157 cm²`, `314 cm²`], 1, `C = 2πr gives r = 31.4 ÷ 6.28 = 5. Area = 3.14 × 25 = 78.5.`),
    Q(`A ribbon 2.4 m long is cut into pieces that are each 30 cm long. How many pieces are there?`, [`6`, `7`, `8`, `80`], 2, `2.4 m = 240 cm. 240 ÷ 30 = 8.`),
    Q(`Point A is at (−2, 3) and point B is at (−2, −4). How far apart are they?`, [`1`, `5`, `6`, `7`], 3, `They share an x-coordinate, so the distance is |3 − (−4)| = 7.`),
    Q(`On a map, 1 inch represents 15 miles. Two cities are 3 3/4 inches apart on the map. What is the actual distance?`, [`45 miles`, `52.5 miles`, `56.25 miles`, `60 miles`], 2, `3.75 × 15 = 56.25.`),
    Q(`A rectangle has a perimeter of 46 cm, and its length is 5 cm more than its width. What is its area?`, [`126 cm²`, `115 cm²`, `138 cm²`, `144 cm²`], 0, `2(w + w + 5) = 46 → 2w + 5 = 23 → w = 9, so l = 14. Area = 9 × 14 = 126.`),
  ],
};

const MOD_D = {
  id: "D", name: "Data and Probability", blurb: "Statistics, graphs, probability, counting", color: "#0369a1",
  lessons: [
    { id: "D1", title: "Mean, median, mode and range", min: 12, blocks: [
      L([
        `Mean = sum ÷ count. Median = middle value of the ordered list (average the two middle values if there is an even count). Mode = most frequent value. Range = greatest − least.`,
        `An extreme value (an outlier) pulls the mean a lot but moves the median only a little.`,
        `To reach a target mean: needed total = target mean × number of values, then subtract what you already have.`,
      ]),
      EX(`After 5 tests Maya's mean is 82. What score on the 6th test gives a mean of 85?`, `Total needed: 6 × 85 = 510. Current total: 5 × 82 = 410. She needs 510 − 410 = 100.`),
      TRAP(`Forgetting to sort the list before finding the median.`),
    ]},
    { id: "D2", title: "Reading graphs and tables", min: 10, blocks: [
      L([
        `Read the title, labels, units, and scale before anything else. Check whether the axis starts at zero.`,
        `Circle graph: angle = fraction × 360°. If 12 of 40 chose tacos, the angle is 12/40 × 360° = 108°.`,
        `Line graphs show change over time. The steepest segment is the fastest change.`,
        `Stem-and-leaf and dot plots show every value, so you can find median and mode directly.`,
      ]),
      EX(`A survey of 40 students: pizza 18, tacos 12, pasta 6, salad 4. What angle would tacos have on a circle graph?`, `12/40 = 0.30, and 0.30 × 360° = 108°.`),
    ]},
    { id: "D3", title: "Probability and counting", min: 13, blocks: [
      L([
        `Probability = favorable outcomes ÷ total outcomes, between 0 and 1.`,
        `Complement: P(not A) = 1 − P(A). Often easier than counting directly ("at least one").`,
        `Independent events multiply. Without replacement, the total shrinks after each draw.`,
        `Counting principle: multiply the number of choices at each step. A president and vice president from 6 students: 6 × 5 = 30.`,
        `Two dice have 36 outcomes. A sum of 7 can happen 6 ways (1/6).`,
      ]),
      EX(`A bag has 5 red, 3 blue, 2 green marbles. Two are drawn without replacement. What is the probability both are red?`, `5/10 × 4/9 = 20/90 = 2/9.`),
      TIP(`For "at least one," use 1 minus the probability of none. At least one 6 in two rolls = 1 − (5/6 × 5/6) = 11/36.`),
    ]},
  ],
  quiz: [
    Q(`Data: 4, 7, 7, 9, 12, 15, 30. Which statement is true?`, [`The mean is less than the median.`, `The mean equals the median.`, `The mean is greater than the median.`, `The mean equals the mode.`], 2, `The mean is 84 ÷ 7 = 12 and the median is 9. The outlier 30 pulls the mean above the median. The mode is 7.`),
    Q(`The mean of five numbers is 18. Four of them are 12, 20, 25, and 15. What is the fifth?`, [`16`, `18`, `20`, `22`], 1, `Total = 5 × 18 = 90. The four known numbers add to 72, so the fifth is 18.`),
    Q(`After 5 tests, Maya's mean is 82. What must she score on test 6 to raise her mean to 85?`, [`95`, `100`, `105`, `90`], 1, `She needs a total of 6 × 85 = 510 and has 5 × 82 = 410. 510 − 410 = 100.`),
    Q(`The set {10, 12, 14, 16, 18} has median 14. If 100 is added to the set, by how much does the median increase?`, [`0`, `1`, `14.33`, `2`], 1, `The new set has 6 values, so the median is the average of 14 and 16, which is 15. It increased by 1.`),
    Q(`A survey of 40 students found: pizza 18, tacos 12, pasta 6, salad 4. On a circle graph, what is the angle for tacos?`, [`90°`, `108°`, `120°`, `72°`], 1, `12/40 × 360° = 108°.`),
    Q(`A spinner has 8 equal sections: 3 red, 2 blue, 2 green, 1 yellow. What is the probability of NOT landing on red?`, [`3/8`, `1/2`, `5/8`, `7/8`], 2, `5 of 8 sections are not red.`),
    Q(`Two fair dice are rolled. What is the probability that the sum is 7?`, [`1/12`, `1/6`, `1/9`, `7/36`], 1, `Six of the 36 outcomes sum to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). 6/36 = 1/6.`),
    Q(`A lunch deal offers 3 sandwiches, 4 drinks, and 2 sides. How many different meals (one of each) are possible?`, [`9`, `12`, `24`, `36`], 2, `3 × 4 × 2 = 24.`),
    Q(`A club of 6 students will choose a president and a different student as vice president. How many ways can this be done?`, [`12`, `15`, `30`, `36`], 2, `6 choices for president, then 5 for vice president: 6 × 5 = 30.`),
  ],
};

const Qp = (p, q, o, a, e, tag) => ({ q, o, a, e, tag, p });

const MOD_W = {
  id: "W", name: "Vocabulary", blurb: "Context clues, word parts, nuance", color: "#be185d",
  lessons: [
    { id: "W1", title: "Context clues", min: 12, blocks: [
      P(`You will almost never be asked about a word with no context. The sentence tells you what it means if you read it like a detective.`),
      H(`Types of clues`),
      L([
        `Definition clue: the sentence defines the word ("a tun, a dry capsule...").`,
        `Synonym clue: a nearby word means the same thing ("meager, scanty rations").`,
        `Contrast clue: signal words like but, although, however, unlike, despite tell you the word means the opposite of a nearby idea.`,
        `Example clue: "such as" or "for instance" lists examples that point to the meaning.`,
        `Inference clue: the whole situation points to the meaning.`,
      ]),
      EX(`Although the instructions seemed ______, requiring several readings before anyone understood them, the final product was simple.`, `"Although" signals a contrast with "simple," and "several readings" shows the instructions were hard to understand. So the best word is "ambiguous" (unclear).`),
      TIP(`Cover the word, predict your own word, then match it to the choices. This protects you from tempting wrong answers.`),
    ]},
    { id: "W2", title: "Word parts: prefixes, roots, suffixes", min: 13, blocks: [
      P(`Learning about twenty parts lets you decode hundreds of words.`),
      H(`Prefixes`),
      L([`anti- (against)`, `bene- (good)`, `mal- (bad)`, `circum- (around)`, `sub- (under)`, `trans- (across)`, `inter- (between)`, `pre- (before)`, `post- (after)`, `uni- (one)`, `un-, in-, im-, dis- (not)`]),
      H(`Roots`),
      L([`rupt (break), as in interrupt`, `dict (say), as in predict`, `port (carry), as in transport`, `spec (look), as in inspect`, `scrib/script (write), as in describe, manuscript`, `struct (build), as in construct`, `vis/vid (see), as in visible`, `aud (hear), as in audible`, `chron (time), as in chronology`, `vol (wish), as in benevolent`]),
      H(`Suffixes`),
      L([`-able, -ible (can be done)`, `-ous, -ful (full of)`, `-ology (study of)`, `-ity, -ness (state of)`, `-less (without)`]),
      EX(`What does "malevolent" most likely mean?`, `mal- = bad and vol = wish. So malevolent means wishing harm. (Benevolent is the opposite: wishing good.)`),
    ]},
    { id: "W3", title: "Nuance, connotation and figurative language", min: 12, blocks: [
      P(`Many words share a dictionary meaning (denotation) but feel different (connotation). Thrifty, frugal, economical, and stingy all describe someone careful with money, but stingy is an insult and frugal is a compliment.`),
      L([
        `Match the tone of the sentence. Is it admiring, neutral, or critical?`,
        `Multiple-meaning words: choose the meaning that fits the sentence. A "novel" idea is new; a novel is a book.`,
        `Figurative language: simile (uses like or as), metaphor (says one thing is another), personification (human traits for non-humans), hyperbole (extreme exaggeration), idiom (a phrase that does not mean what the words say).`,
      ]),
      EX(`"The classroom was a zoo when the substitute arrived." What does this mean?`, `It is a metaphor for wild, noisy chaos. The classroom does not literally contain animals.`),
      TRAP(`Picking a word because you know it. Choose the word that fits the sentence's tone and logic.`),
    ]},
  ],
  quiz: [
    Q(`The detective's ______ questions quickly exposed the gaps in the witness's story.`, [`trivial`, `incisive`, `ample`, `serene`], 1, `"Incisive" means sharp, clear, and direct, which fits questions that expose gaps. "Trivial" means unimportant, "ample" means plentiful, and "serene" means calm.`),
    Q(`The root "vol" means "wish." What does "malevolent" most likely mean?`, [`wishing for good things`, `wishing harm on others`, `wishing for nothing`, `wishing for money`], 1, `mal- means bad, so malevolent means wishing harm.`),
    Q(`The root "rupt" means "break." Which word means "to break into someone's conversation"?`, [`erupt`, `interrupt`, `corrupt`, `abrupt`], 1, `inter- means between, so interrupt means to break in between.`),
    Q(`Which word describes someone who saves money wisely, with a POSITIVE tone?`, [`stingy`, `miserly`, `frugal`, `greedy`], 2, `Frugal is positive. Stingy, miserly, and greedy are negative.`),
    Q(`In which sentence does the word "novel" mean "new and original"?`, [`She read a novel on the train.`, `The inventor proposed a novel solution to the problem.`, `The novel was 300 pages long.`, `He wrote a novel last year.`], 1, `Only choice B uses "novel" as an adjective meaning new and different.`),
    Q(`Which word means the OPPOSITE of "ephemeral"?`, [`fleeting`, `permanent`, `delicate`, `colorful`], 1, `Ephemeral means lasting a very short time. Permanent is the opposite.`),
    Q(`Although the instructions seemed ______, requiring several readings before anyone understood them, the final product was simple.`, [`lucid`, `ambiguous`, `concise`, `candid`], 1, `Ambiguous means unclear. "Lucid" means clear, which contradicts "several readings."`),
    Q(`"The classroom was a zoo when the substitute arrived." The author means that`, [`the class had animals`, `the class was wild and noisy`, `the class was unusually quiet`, `the class was studying animals`], 1, `It is a metaphor. A zoo is loud and chaotic.`),
    Q(`Which pair of words are closest in meaning?`, [`obstinate and flexible`, `tenacious and persistent`, `meager and abundant`, `hostile and friendly`], 1, `Tenacious and persistent both mean refusing to give up. The other pairs are opposites.`),
    Q(`The prefix "uni-" means "one." If a decision is "unanimous," then`, [`everyone agreed`, `most people agreed`, `only one person voted`, `no one voted`], 0, `Unanimous literally means "of one mind."`),
  ],
};

const MOD_R = {
  id: "R", name: "Reading Comprehension", blurb: "Main idea, inference, analysis", color: "#1d4ed8",
  lessons: [
    { id: "R1", title: "Main idea and supporting details", min: 12, blocks: [
      L([
        `The main idea is what the whole passage is mostly about, in one sentence. A detail supports it.`,
        `After each paragraph, jot a three-word label in your head or margin. The labels together give you the main idea.`,
        `Wrong main-idea choices are usually too narrow (only one paragraph) or too broad (bigger than the passage).`,
        `For detail questions, go back and find the exact sentence. Never answer from memory.`,
      ]),
      EX(`A passage describes how a bee's hexagon cells save wax, then how physics may form them. Which main idea fits best?`, `"The honeycomb's hexagon shape is efficient and may arise partly from physical forces." It covers both paragraphs. "Bees save wax" covers only one.`),
    ]},
    { id: "R2", title: "Inference and evidence", min: 13, blocks: [
      L([
        `An inference is a conclusion that is strongly supported by the text, but not stated outright.`,
        `The safest answer can be backed with a specific line from the passage.`,
        `Wrong answers are usually: too extreme (always, never, only), out of scope (not in the passage), the opposite of what the text says, or true but irrelevant.`,
        `"Best supported" questions reward the modest answer, not the dramatic one.`,
      ]),
      EX(`"Dev nodded like someone who had received excellent advice and then immediately forgotten it." What does this suggest?`, `Dev heard the advice but did not follow it, which is why he rushed and made a mistake.`),
      TRAP(`Choosing an answer you believe is true in real life but that the passage does not support.`),
    ]},
    { id: "R3", title: "Purpose, tone, structure and figurative language", min: 15, blocks: [
      L([
        `Author's purpose: to inform (facts), to persuade (opinions and calls to act), to entertain (story, humor), or to explain how.`,
        `Tone is the author's attitude. Look for word choice: admiring, skeptical, humorous, urgent, neutral.`,
        `Text structure: chronological, cause and effect, compare and contrast, problem and solution, description.`,
        `Figurative language: ask what feeling or idea the comparison creates, not only what it literally says. A laugh "like a drawer opening in an empty house" feels sudden and lonely.`,
        `Fiction: theme is the lesson or big idea. Character traits are shown through actions, thoughts, and dialogue.`,
      ]),
      EX(`In a story, a character "listened to the silence as though it were an answer." What does that show?`, `He accepts that the silence itself is a kind of response, a quiet acceptance. The line is about feeling, not about sound.`),
    ]},
  ],
  passages: [
    { id: "RA", title: "Why Bees Build Hexagons", text: [
      `For centuries, people have admired the honeycomb. Each cell is a six-sided hexagon, and the cells fit together with no wasted gaps. Mathematicians have shown why this shape is so smart. Of the shapes that can tile a surface without leaving spaces (triangles, squares, and hexagons), the hexagon holds the most honey for the least amount of wax. Since making wax costs a colony a great deal of energy, saving wax saves food.`,
      `But do bees actually calculate? Probably not. Some scientists suggest that bees first build rounded cells. The warm wax then softens and flows, and the cells settle into hexagons much as soap bubbles pressed together do. If so, the bees' skill may owe as much to physics as to planning. Either way, the result is a design that engineers still copy when they need structures that are both light and strong.`,
    ]},
    { id: "RB", title: "The Chess Tournament", text: [
      `Dev set the pawn down and immediately wished he could take it back. From the sidelines, Coach Okafor's eyebrows rose a quarter inch, which, for a man who rarely showed anything, was practically a shout. Around them, the gym hummed with the click of clocks and a hundred nervous whispers. Dev's palms were damp. He had spent three months memorizing openings, yet in the last ten minutes he had thrown away a rook by hurrying.`,
      `"Take your time," Coach Okafor had said that morning. Dev had nodded like someone who had received excellent advice and then immediately forgotten it. Now he forced himself to breathe, folded his hands in his lap, and studied the board as though it were a map of a country he had never visited. A bishop gleamed on the far diagonal, unguarded. Slowly, the corner of his mouth lifted. He might still lose. But for the first time in an hour, he was playing the game in front of him rather than the game in his head.`,
    ]},
  ],
  quiz: [
    Qp(0, `Which statement best expresses the main idea of the passage about honeycombs?`, [`Bees are better at mathematics than most people.`, `The hexagon shape of honeycomb is efficient, and it may form partly because of physical forces.`, `Soap bubbles are shaped like hexagons.`, `Engineers learned to build from bees.`], 1, `This covers both paragraphs. The others are too extreme, too narrow, or not the focus.`),
    Qp(0, `According to the passage, which shapes can fit together without leaving gaps?`, [`Circles, squares, and hexagons`, `Triangles, squares, and hexagons`, `Triangles, circles, and pentagons`, `Only hexagons`], 1, `The first paragraph names triangles, squares, and hexagons.`),
    Qp(0, `Why does saving wax matter to a bee colony?`, [`Wax is needed to feed young bees directly.`, `Making wax uses a lot of energy, so saving wax saves food.`, `Wax is very rare in nature.`, `Engineers need the wax for building.`], 1, `The passage says making wax costs the colony a great deal of energy, so saving wax saves food.`),
    Qp(0, `As used in the second paragraph, "owe as much to physics as to planning" means the bees' skill`, [`is a debt that must be repaid`, `may result as much from physical forces as from deliberate planning`, `is mostly caused by planning`, `cannot be explained by science`], 1, `"Owe" here means "be explained by." The sentence says physics may matter as much as planning.`),
    Qp(0, `How does the second paragraph relate to the first?`, [`It repeats the same facts in different words.`, `It raises a question about the first paragraph's implied idea that bees plan and offers another explanation.`, `It disproves the claim that hexagons save wax.`, `It describes a different kind of insect.`], 1, `Paragraph 2 asks "do bees actually calculate?" and offers a physical explanation, while still accepting the efficiency described earlier.`),
    Qp(1, `Why did Coach Okafor's eyebrows rise?`, [`He was amused by Dev's play.`, `He noticed that Dev had made a mistake.`, `He was surprised by Dev's calm.`, `He wanted Dev to resign.`], 1, `Dev had set the pawn down and wished he could take it back, and the coach reacted immediately.`),
    Qp(1, `The sentence "Dev had nodded like someone who had received excellent advice and then immediately forgotten it" suggests that Dev`, [`did not hear the coach`, `heard the coach's advice but rushed anyway`, `disliked the coach`, `planned to ignore the coach`], 1, `He acknowledged the advice ("nodded") but then hurried and threw away a rook.`),
    Qp(1, `Studying the board "as though it were a map of a country he had never visited" shows that Dev`, [`was lost and confused`, `was looking carefully and slowly, as at something unfamiliar`, `was ready to give up`, `thought the game was unfair`], 1, `Someone studying an unfamiliar map looks carefully and takes time. That is the opposite of rushing.`),
    Qp(1, `What does the phrase "the game in his head" most likely mean?`, [`a video game`, `his worries and imagined plans`, `a game he had invented`, `his coach's strategy`], 1, `It contrasts with "the game in front of him," so it means his worries and imaginings instead of the actual position.`),
    Qp(1, `Which theme is best supported by the passage?`, [`Winning is the only thing that matters.`, `Calm, focused attention on the present can matter more than past mistakes or worries.`, `Coaches should not give advice.`, `Memorizing openings is a waste of time.`], 1, `Dev recovers by breathing, slowing down, and focusing on the board in front of him.`),
  ],
};

const MOD_M = {
  id: "M", name: "Writing Mechanics", blurb: "Punctuation, grammar, capitalization, spelling", color: "#047857",
  lessons: [
    { id: "M1", title: "Punctuation", min: 15, blocks: [
      L([
        `Comma after an introductory clause or phrase: "Although the storm was fierce, the crew stayed calm."`,
        `Comma before a conjunction (and, but, or, so) that joins two complete sentences.`,
        `Commas around nonessential information: "My sister, who lives in Denver, is visiting."`,
        `Commas between coordinate adjectives: "tired, hungry hikers" (you can swap them or put "and" between).`,
        `Semicolon joins two closely related complete sentences. A semicolon cannot go before "but" or after "although."`,
        `Colon follows a complete sentence and introduces a list or explanation.`,
        `Apostrophes: singular possessive 's (girl's), plural ending in s adds only ' (girls'), irregular plurals add 's (children's). Contractions use an apostrophe (it's = it is). Possessive "its" has no apostrophe.`,
        `Dialogue: commas and ending marks go inside quotation marks. "Let's go," said Priya, "before it gets dark."`,
        `Hyphens join compound modifiers before a noun: a twelve-year-old student.`,
      ]),
      EX(`Which is correct? (A) The package which arrived late, was damaged. (B) The package, which arrived late, was damaged.`, `B. "Which arrived late" is extra information, so it needs commas on both sides.`),
    ]},
    { id: "M2", title: "Grammar and usage", min: 18, blocks: [
      L([
        `Subject-verb agreement: ignore the prepositional phrase. "The box of old photographs IS on the shelf."`,
        `With "neither...nor" and "either...or," the verb agrees with the closer subject. "Neither the coach nor the players WERE ready."`,
        `Each, every, everyone, someone, and neither are singular.`,
        `Pronoun case: test by removing the other person. "Marcus and I built it" (I built it). "Between you and me" (after a preposition use me).`,
        `Who vs. whom: who is the subject (he), whom is the object (him). "To whom should we give the award?"`,
        `Verb tense: keep tenses consistent. Past perfect (had + past participle) shows an action finished before another past action: "Mom had set the table before the guests arrived."`,
        `Adjective vs. adverb: adverbs modify verbs ("sang beautifully"). After linking verbs (look, feel, seem) use an adjective ("looked beautiful").`,
        `Commonly confused: its/it's, their/there/they're, affect (verb) / effect (noun), then/than, to/too/two, lose/loose.`,
      ]),
      EX(`She is the student ______ I believe won the award.`, `"Who." Remove "I believe": "She is the student who won the award." Who is the subject of "won."`),
    ]},
    { id: "M3", title: "Capitalization, spelling and sentence structure", min: 12, blocks: [
      L([
        `Capitalize proper nouns (Lake Michigan, Chicago) and titles used as names (Uncle Raj, but "my uncle"). Do not capitalize seasons or general directions.`,
        `A fragment lacks a subject, a verb, or a complete thought. "Because the bridge was closed." is a fragment.`,
        `A run-on or comma splice joins two sentences with no conjunction or only a comma. Fix with a period, semicolon, or comma plus conjunction.`,
        `Parallel structure: keep list items in the same form. "She likes hiking, swimming, and riding bikes."`,
        `Spelling traps: definitely, occasion, necessary, separate, receive, privilege, guarantee, maintenance, acquaintance, embarrass.`,
      ]),
      EX(`Which is parallel? (A) She likes hiking, to swim, and bike rides. (B) She likes hiking, swimming, and riding bikes.`, `B. All three items are -ing forms.`),
    ]},
  ],
  quiz: [
    Q(`Which sentence is punctuated correctly?`, [`Although the storm was fierce, the ship's crew remained calm.`, `Although the storm was fierce the ship's crew, remained calm.`, `Although, the storm was fierce the ship's crew remained calm.`, `Although the storm was fierce the ship's crew remained, calm.`], 0, `A comma follows an introductory clause.`),
    Q(`Which sentence uses a semicolon correctly?`, [`I wanted to go; but it was too late.`, `I wanted to go; it was too late.`, `Although I wanted to go; it was too late.`, `I wanted; to go it was too late.`], 1, `A semicolon joins two complete sentences without a conjunction.`),
    Q(`Neither the coach nor the players ______ ready for the early game.`, [`was`, `were`, `is`, `has been`], 1, `The verb agrees with the nearer subject, "players" (plural).`),
    Q(`To ______ should the committee give the award?`, [`who`, `whom`, `whose`, `who's`], 1, `"To" is a preposition, so use the object form "whom."`),
    Q(`The company changed ______ policy after ______ clear that customers were unhappy.`, [`its; it's`, `it's; its`, `its; its`, `it's; it's`], 0, `"Its" is possessive. "It's" means "it was" here.`),
    Q(`Which sentence has parallel structure?`, [`She likes hiking, to swim, and riding bikes.`, `She likes hiking, swimming, and riding bikes.`, `She likes to hike, swimming, and to ride bikes.`, `She likes hiking, to swim, and bike rides.`], 1, `All three items are -ing forms.`),
    Q(`Which is a complete sentence?`, [`Because the bridge was closed for repairs.`, `Running through the park every morning.`, `The bridge, which was closed for repairs, forced us to take a detour.`, `Whenever it rains in the afternoon.`], 2, `Only C has a subject (bridge), a verb (forced), and a complete thought.`),
    Q(`By the time the guests arrived, Mom ______ the table.`, [`set`, `had set`, `has set`, `was setting`], 1, `Past perfect shows an action completed before another past action.`),
    Q(`She sang ______ at the concert, and everyone said she looked ______.`, [`beautiful; beautifully`, `beautifully; beautiful`, `beautifully; beautifully`, `beautiful; beautiful`], 1, `"Sang" is a verb, so use the adverb "beautifully." "Looked" is a linking verb, so use the adjective "beautiful."`),
    Q(`The new rule will ______ everyone, but its ______ on younger students will be greatest.`, [`effect; affect`, `affect; effect`, `affect; affect`, `effect; effect`], 1, `Affect is the verb. Effect is the noun ("its effect").`),
  ],
};

const MOD_C = {
  id: "C", name: "Writing Concepts and Skills", blurb: "Paragraphs, transitions, revision, audience", color: "#b45309",
  lessons: [
    { id: "C1", title: "Paragraphs and topic sentences", min: 10, blocks: [
      L([
        `A topic sentence states the main idea. It should be broad enough to cover the paragraph but specific enough to say something.`,
        `Supporting sentences give reasons, examples, or facts. Every sentence must support the topic.`,
        `A sentence that wanders off topic does not belong (unity).`,
        `Sentences should follow a logical order (time, steps, cause and effect, importance). Look for signal words.`,
      ]),
      EX(`Best topic sentence for a paragraph about recycling's benefits? (A) Many people recycle. (B) Recycling helps protect the environment by reducing waste and saving resources.`, `B. It states a clear main idea the details can support. A is too weak and says nothing specific.`),
    ]},
    { id: "C2", title: "Transitions and combining sentences", min: 12, blocks: [
      L([
        `Choose a transition for the relationship: contrast (however, nevertheless, but), cause/effect (therefore, as a result, consequently), addition (also, furthermore), example (for instance), sequence (first, next, finally).`,
        `Combine short choppy sentences with conjunctions, subordinate clauses, or appositives: "Ms. Alvarez, our science teacher, won a state award."`,
        `A participial phrase can also combine: "Running home, Jo found her keys."`,
        `Avoid comma splices when combining. Use a conjunction, a semicolon, or subordination.`,
      ]),
      EX(`Many students find math hard. ______, with regular practice, most improve.`, `"However" shows contrast between "hard" and "improve."`),
      TRAP(`Picking a transition because it sounds formal. Decide the relationship between the two ideas first.`),
    ]},
    { id: "C3", title: "Revising for precision, concision and audience", min: 12, blocks: [
      L([
        `Precision: swap vague words for specific ones. "Bounded" is stronger than "went."`,
        `Concision: cut redundant phrases. "The reason why I was late is because..." becomes "I was late because..."`,
        `Audience and purpose: formal writing (letters to the principal) avoids slang. Informal writing (a text to a friend) can relax.`,
        `Point of view: stay consistent (do not shift from "a person" to "you").`,
        `A strong concluding sentence echoes the main idea and leaves a final thought or call to action.`,
      ]),
      EX(`Which is most concise? (A) In my opinion, I think the final ending was disappointing. (B) The ending was disappointing.`, `B. Choice A repeats the idea three times.`),
    ]},
  ],
  quiz: [
    Q(`Study after study shows that students who sleep 8 hours remember more. Teens who stay up late score lower on tests. Even one missed night can hurt focus. Which topic sentence best introduces these details?`, [`Sleep is something everyone does.`, `Getting enough sleep is essential for learning and memory.`, `Many teenagers like to stay up late.`, `Tests are given in most schools.`], 1, `B names the main idea that all the details support.`),
    Q(`Many students find math challenging. ______, with regular practice, most improve.`, [`For instance`, `Similarly`, `However`, `Therefore`], 2, `The second sentence contrasts with the first, so "However" fits.`),
    Q(`Which sentence is the most concise and clear?`, [`In my opinion, I think the final ending was disappointing.`, `The ending was disappointing.`, `I personally think the final end was disappointing in my opinion.`, `The movie's ending, which was the end, disappointed.`], 1, `Choice B says everything with no repetition.`),
    Q(`Which sentence best combines these? "Ms. Alvarez is our science teacher. Ms. Alvarez won a state award."`, [`Ms. Alvarez our science teacher won a state award.`, `Ms. Alvarez, our science teacher, won a state award.`, `Ms. Alvarez is our science teacher, she won a state award.`, `Our science teacher is Ms. Alvarez won a state award.`], 1, `The appositive "our science teacher" is set off with commas.`),
    Q(`Which sentence is most appropriate for a formal letter to the principal?`, [`Hey, you should totally let us have a longer lunch.`, `We respectfully request that lunch be extended by ten minutes.`, `Lunch is way too short, dude.`, `Make lunch longer or else.`], 1, `Formal tone and polite wording fit the audience.`),
    Q(`Read: (1) Volcanoes form where magma reaches the surface. (2) Some build cone-shaped mountains over time. (3) My cousin lives near a small hill. (4) Others erupt in sudden explosions. Which sentence does NOT belong?`, [`Sentence 1`, `Sentence 2`, `Sentence 3`, `Sentence 4`], 2, `Sentence 3 is about a cousin and a hill, not volcanoes.`),
    Q(`Choose the best order. (1) As a result, many coastal towns now require flood barriers. (2) Sea levels have risen slowly for more than a century. (3) Higher water lets storm surges reach farther inland. (4) Scientists link this rise mainly to warming oceans and melting ice.`, [`2, 4, 3, 1`, `4, 2, 1, 3`, `2, 3, 4, 1`, `1, 2, 3, 4`], 0, `Start with the fact (2), then the cause (4), then the effect (3), then the response ("As a result," 1).`),
    Q(`Which sentence keeps a consistent point of view?`, [`When a person studies regularly, you remember more.`, `When you study regularly, you remember more.`, `When a person studies regularly, they remember more, and you will too.`, `When one studies regularly, we remember more.`], 1, `Choice B uses "you" throughout.`),
  ],
};

const MODULES = [MOD_V, MOD_Q, MOD_N, MOD_A, MOD_G, MOD_D, MOD_W, MOD_R, MOD_M, MOD_C];

const WORDS = [
  ["abate", "to become less intense", "The storm finally began to abate by dawn."],
  ["adversity", "hardship or difficulty", "She showed courage in the face of adversity."],
  ["aloof", "distant and not friendly", "The new student seemed aloof, but she was just shy."],
  ["ambiguous", "unclear; open to more than one meaning", "The ambiguous directions confused everyone."],
  ["ample", "more than enough", "We had ample time to finish the project."],
  ["anecdote", "a short, interesting story about a real event", "Grandpa told an anecdote about his first day of school."],
  ["arduous", "difficult and tiring", "The arduous climb took six hours."],
  ["astute", "quick to notice and understand", "An astute reader spotted the hidden clue."],
  ["audacious", "boldly daring, sometimes rudely so", "The audacious plan surprised the whole town."],
  ["benevolent", "kind and generous", "The benevolent donor funded a new library."],
  ["candid", "honest and direct", "She gave a candid answer, even though it was hard to hear."],
  ["coherent", "logical and clear; hanging together well", "His essay was coherent from start to finish."],
  ["diligent", "hardworking and careful", "A diligent student reviews notes every night."],
  ["discreet", "careful about what you say; not drawing attention", "Be discreet about the surprise party."],
  ["dubious", "doubtful; not to be trusted", "I was dubious about the miracle cure."],
  ["eloquent", "expressing ideas clearly and persuasively", "The eloquent speaker inspired the crowd."],
  ["elusive", "hard to find, catch, or understand", "The elusive fox disappeared into the trees."],
  ["enigma", "a puzzling person or thing", "The ancient stone circle remains an enigma."],
  ["ephemeral", "lasting a very short time", "The beauty of the rainbow was ephemeral."],
  ["exasperate", "to annoy greatly", "The constant noise began to exasperate the teacher."],
  ["exemplary", "serving as an excellent example", "Her exemplary behavior earned praise."],
  ["fastidious", "very careful about details; hard to please", "He was fastidious about keeping his notes in order."],
  ["feasible", "possible to do", "Is it feasible to finish by Friday?"],
  ["fluctuate", "to rise and fall irregularly", "Temperatures fluctuate wildly in the spring."],
  ["frugal", "careful with money", "A frugal shopper compares prices."],
  ["gregarious", "sociable; enjoying being with others", "The gregarious host greeted every guest."],
  ["hamper", "to hinder or slow down", "Heavy rain can hamper the rescue effort."],
  ["hostile", "unfriendly; showing opposition", "The crowd was hostile toward the referee."],
  ["impartial", "fair; not favoring either side", "A judge must be impartial."],
  ["indignant", "angry because of unfair treatment", "She was indignant when she was blamed for the mistake."],
  ["inevitable", "certain to happen; unavoidable", "With no one studying, failure seemed inevitable."],
  ["innovative", "introducing new ideas or methods", "The innovative design saved energy."],
  ["jubilant", "joyful and triumphant", "The jubilant fans cheered after the win."],
  ["lethargic", "sluggish; lacking energy", "The heat made everyone feel lethargic."],
  ["lucid", "clear and easy to understand", "A lucid explanation helps everyone."],
  ["meager", "small in amount; inadequate", "The meager meal barely fed three people."],
  ["meticulous", "extremely careful and precise", "The meticulous artist painted every detail."],
  ["mundane", "ordinary; dull", "He escaped his mundane routine by traveling."],
  ["novice", "a beginner", "Even a novice can learn the basics quickly."],
  ["obsolete", "no longer used because newer things exist", "Floppy disks are now obsolete."],
  ["obstinate", "stubborn; refusing to change", "The obstinate mule would not move."],
  ["ominous", "suggesting something bad will happen", "Ominous clouds gathered on the horizon."],
  ["peculiar", "strange; unusual", "A peculiar smell came from the attic."],
  ["perceptive", "quick to notice and understand", "A perceptive teacher saw that he was upset."],
  ["perilous", "full of danger", "The perilous path ran along a cliff."],
  ["persevere", "to keep trying despite difficulty", "Athletes must persevere through hard training."],
  ["pragmatic", "practical; focused on what works", "She took a pragmatic approach to the problem."],
  ["precarious", "unstable; dangerously uncertain", "The book balanced in a precarious position on the edge."],
  ["prudent", "wise and careful about the future", "It is prudent to save some money."],
  ["reluctant", "unwilling; hesitant", "He was reluctant to speak in front of the class."],
  ["resilient", "able to recover quickly from difficulty", "Resilient kids bounce back from setbacks."],
  ["scrutinize", "to examine very closely", "Scientists scrutinize each result."],
  ["serene", "calm and peaceful", "The lake was serene at sunrise."],
  ["skeptical", "doubtful; questioning", "She was skeptical until she saw the proof."],
  ["sporadic", "happening now and then, not regularly", "Sporadic showers fell throughout the day."],
  ["subtle", "delicate; hard to notice", "A subtle change in tone told me she was upset."],
  ["tenacious", "persistent; refusing to give up", "The tenacious climber would not turn back."],
  ["trivial", "of little importance", "Don't argue over trivial things."],
  ["verbose", "using more words than necessary", "His verbose reply took ten minutes."],
  ["vigilant", "watchful; alert to danger", "Lifeguards must stay vigilant."],
  ["wary", "cautious about possible danger", "Be wary of strangers online."],
  ["zealous", "full of eager energy for a cause", "The zealous volunteers cleaned the whole park."],
];

/* ===================== PRACTICE TESTS ===================== */
const TEST1 = {
  id: "T1", name: "Practice Test 1: Checkpoint", blurb: "64 questions, 7 sections, built hard on purpose",
  sections: [
    { id: "VR", name: "Verbal Reasoning", min: 10, tag: "V", qs: [
      Q(`Brittle : shatter :: elastic : ___`, [`stretch`, `bounce`, `break`, `rubber`], 0, `A brittle object characteristically shatters. An elastic object characteristically stretches.`),
      Q(`Thesaurus : synonyms :: atlas : ___`, [`maps`, `explorers`, `words`, `oceans`], 0, `A thesaurus is a book of synonyms. An atlas is a book of maps.`),
      Q(`Lull : storm :: intermission : ___`, [`theater`, `performance`, `ticket`, `applause`], 1, `A lull is a pause in a storm. An intermission is a pause in a performance.`),
      Q(`Novice : expert :: sapling : ___`, [`seed`, `forest`, `mature tree`, `leaf`], 2, `A novice is an inexperienced version of an expert. A sapling is a young version of a mature tree.`),
      Q(`Which word does NOT belong? sonnet, haiku, limerick, novella`, [`sonnet`, `haiku`, `limerick`, `novella`], 3, `The first three are forms of poetry. A novella is a short work of prose fiction.`),
      Q(`No reptiles have fur. Some pets have fur. Which statement MUST be true?`, [`No pets are reptiles.`, `Some pets are not reptiles.`, `All pets have fur.`, `Some reptiles are pets.`], 1, `The pets that have fur cannot be reptiles, so some pets are not reptiles. Other pets could be reptiles, so A is not forced.`),
      Q(`Ana finished ahead of Ben but behind Cy. Dee finished ahead of Cy. Eli finished immediately after Ben. Who finished third?`, [`Ana`, `Ben`, `Cy`, `Dee`], 0, `The order is Dee, Cy, Ana, Ben, Eli. Third is Ana.`),
      Q(`Despite the ______ of evidence against him, the defendant calmly maintained his innocence.`, [`scarcity`, `abundance`, `secrecy`, `simplicity`], 1, `"Despite" signals contrast with his calm denial. A large amount of evidence (abundance) creates the contrast.`),
    ]},
    { id: "QR", name: "Quantitative Reasoning", min: 12, tag: "Q", qs: [
      Q(`2, 3, 5, 9, 17, ___`, [`25`, `31`, `33`, `35`], 2, `Differences are 1, 2, 4, 8, so the next is +16. 17 + 16 = 33.`),
      Q(`100, 91, 83, 76, 70, ___`, [`64`, `65`, `66`, `60`], 1, `Differences are −9, −8, −7, −6, so next is −5. 70 − 5 = 65.`),
      Q(`A, 2, C, 4, E, 6, G, ___`, [`7`, `8`, `H`, `9`], 1, `Letters (A, C, E, G) alternate with even numbers (2, 4, 6, next 8).`),
      Q(`Which is greater: 2^10 or 10^3?`, [`10^3`, `They are equal`, `Cannot be determined`, `2^10`], 3, `2^10 = 1,024 and 10^3 = 1,000.`),
      Q(`If f(n) = n² − 2n, what is f(7) − f(5)?`, [`10`, `20`, `24`, `30`], 1, `f(7) = 49 − 14 = 35 and f(5) = 25 − 10 = 15. 35 − 15 = 20.`),
      Q(`A number is tripled, then 8 is subtracted, then the result is halved. The final result is 11. What was the original number?`, [`8`, `10`, `12`, `14`], 1, `Work backward: 11 × 2 = 22, 22 + 8 = 30, 30 ÷ 3 = 10.`),
      Q(`In each row the third number follows the same rule. Row 1: 2, 3, 10. Row 2: 4, 1, 20. Row 3: 5, 3, ___`, [`24`, `35`, `40`, `45`], 2, `The rule is (first + second) × first: (2+3)×2 = 10, (4+1)×4 = 20, so (5+3)×5 = 40.`),
      Q(`The sum of three consecutive even numbers is 78. What is the largest of the three?`, [`24`, `26`, `28`, `30`], 2, `n + (n+2) + (n+4) = 78 → 3n + 6 = 78 → n = 24. The numbers are 24, 26, 28.`),
    ]},
    { id: "VO", name: "Vocabulary", min: 8, tag: "W", qs: [
      Q(`The explorer's journey was <u>arduous</u>, taking months across steep, frozen terrain.`, [`difficult and tiring`, `peaceful`, `brief`, `unplanned`], 0, `Arduous means demanding great effort.`),
      Q(`The teacher's <u>candid</u> feedback was honest, if a little blunt.`, [`secretive`, `frank`, `cheerful`, `lengthy`], 1, `Candid means honest and direct.`),
      Q(`The <u>tenacious</u> climber refused to turn back despite the storm.`, [`careless`, `frightened`, `determined`, `lonely`], 2, `Tenacious means holding on and not giving up.`),
      Q(`Her <u>ambiguous</u> reply left us unsure whether she would agree.`, [`unclear`, `rude`, `enthusiastic`, `quick`], 0, `Ambiguous means open to more than one meaning.`),
      Q(`The <u>meager</u> meal barely fed three people.`, [`delicious`, `enormous`, `inadequate`, `expensive`], 2, `Meager means very small or not enough.`),
      Q(`With only one factory providing jobs, the town's economy was <u>precarious</u>.`, [`booming`, `unstable`, `peaceful`, `diverse`], 1, `Precarious means dangerously uncertain.`),
      Q(`The coach urged the team to be <u>vigilant</u> during the final minutes.`, [`watchful`, `relaxed`, `loud`, `patient`], 0, `Vigilant means alert and watching carefully.`),
      Q(`The fabric's <u>subtle</u> pattern could be seen only in bright light.`, [`bold`, `colorful`, `hard to notice`, `torn`], 2, `Subtle means delicate and not obvious.`),
      Q(`Which word is the best antonym of <u>diligent</u>?`, [`hardworking`, `careless`, `thorough`, `punctual`], 1, `Diligent means careful and hardworking. Careless is the opposite.`),
      Q(`Which pair of words are closest in meaning?`, [`lethargic and energetic`, `obstinate and stubborn`, `frugal and extravagant`, `scarce and abundant`], 1, `Obstinate and stubborn are synonyms. The other pairs are antonyms.`),
    ]},
    { id: "RC", name: "Reading Comprehension", min: 20, tag: "R",
      passages: [
        { id: "T1A", title: "The Water Bear", text: [
          `At barely a millimeter long, the tardigrade looks like a plump, eight-legged gummy bear, which is probably why it earned the nickname "water bear." Yet this microscopic animal, found everywhere from mountaintop moss to ocean mud, may be the toughest creature on Earth.`,
          `The secret is a trick called cryptobiosis. When its surroundings dry out, a tardigrade pulls in its legs, expels most of its water, and shrivels into a tiny, dry capsule known as a tun. In this state its metabolism, the chemical activity that keeps a body running, slows to a tiny fraction of its normal rate. A tun can wait for years. Add water, and within hours the animal plumps up, uncurls, and wanders off as though nothing had happened.`,
          `Tardigrades in this dried state have survived temperatures far below freezing, crushing pressure, and doses of radiation that would be deadly to people. In 2007, a European experiment even exposed some to the vacuum of space; a number of them survived and went on to lay eggs after returning to Earth.`,
          `Researchers are not studying tardigrades simply out of curiosity. They hope that understanding how the animals protect their cells could someday help doctors preserve vaccines without refrigeration, or protect astronauts on long space flights. For now, though, the water bear keeps most of its secrets.`,
        ]},
        { id: "T1B", title: "The Silver Watch", text: [
          `The shop smelled of oil and old paper, and Grandfather's clock repair bench sat beneath the window where the afternoon light fell in a neat rectangle. Inés had been told, repeatedly, not to touch anything. She touched the small silver watch anyway.`,
          `"Careful," said Grandfather without looking up. He had a way of noticing things the way a heron notices fish: completely, and without appearing to try. "That one has been broken for forty years."`,
          `"Why keep it, then?"`,
          `He set down his tweezers. "My father gave it to me the day I left home. It stopped the winter he died." He said it plainly, the way a person reads a measurement. "I have never found the fault, and I have never stopped looking."`,
          `Inés turned the watch over. Its back was worn smooth by thumbs. "Maybe nothing's wrong with it," she said slowly. "Maybe it just stopped."`,
          `For a long moment the only sound was the ticking of a dozen clocks, all slightly out of agreement with one another. Then Grandfather laughed, a short, startled sound, like a drawer opening in an empty house. "Forty years," he said, "and no one has ever suggested that."`,
          `He did not pick up the tweezers again. Instead he wound the watch gently, held it to his ear, and listened to the silence as though it were an answer.`,
        ]},
      ],
      qs: [
        Qp(0, `Which statement best expresses the main idea of the passage?`, [`Tardigrades are the most common animals on Earth.`, `Tardigrades survive extreme conditions by drying out, and scientists hope to learn from them.`, `Scientists have invented a way to protect astronauts from radiation.`, `Tardigrades can only live in space.`], 1, `The passage explains cryptobiosis and the research hopes. The others are too narrow, unsupported, or false.`),
        Qp(0, `According to the passage, what happens when water is added to a tun?`, [`It dies within hours.`, `The animal plumps up and revives within hours.`, `It slowly shrivels further.`, `It must be frozen first.`], 1, `The second paragraph says "within hours the animal plumps up, uncurls, and wanders off."`),
        Qp(0, `The author writes that the animal wanders off "as though nothing had happened" to emphasize that`, [`the animal is confused`, `the animal recovers so completely and easily`, `the animal was never dried out`, `researchers ignore the animal`], 1, `The phrase stresses how fully the tardigrade bounces back.`),
        Qp(0, `Which statement is best supported by the passage?`, [`All tardigrades exposed to space survived.`, `Scientists have already created refrigeration-free vaccines.`, `The dried state is central to the tardigrade's ability to endure extreme conditions.`, `Tardigrades can live only in water.`], 2, `The passage links survival of extreme conditions to the dried tun state. "A number of them survived" does not mean all, and the vaccine idea is only a hope.`),
        Qp(0, `The final paragraph mainly serves to`, [`argue that tardigrades are dangerous`, `explain why the research matters while noting how much remains unknown`, `describe the tardigrade's appearance`, `summarize the 2007 experiment`], 1, `It gives the goals of the research and ends by noting that most secrets remain.`),
        Qp(1, `The comparison of Grandfather to a heron suggests that he`, [`is tall and thin`, `notices things fully, yet quietly`, `is often hungry`, `moves very quickly`], 1, `The text says the heron notices fish "completely, and without appearing to try."`),
        Qp(1, `Why does the silver watch matter so much to Grandfather?`, [`It is very valuable.`, `It was his father's gift and stopped the winter his father died.`, `He hopes to sell it.`, `Inés wants to own it.`], 1, `He explains it was given by his father and stopped when his father died.`),
        Qp(1, `"He said it plainly, the way a person reads a measurement" suggests that Grandfather`, [`does not care about his father`, `speaks calmly without showing outward emotion, though the memory matters`, `is bored by Inés`, `is pretending to be angry`], 1, `His flat delivery contrasts with how much the watch obviously means to him ("never stopped looking").`),
        Qp(1, `What does Inés's suggestion ("Maybe it just stopped") change for Grandfather?`, [`He decides to sell the watch.`, `He considers that the watch may not have a fault to fix, and he stops trying.`, `He becomes angry with her.`, `He teaches her to repair clocks.`], 1, `He laughs, puts down his tweezers, and listens to the silence, accepting a new way of seeing the watch.`),
        Qp(1, `The simile "like a drawer opening in an empty house" suggests that Grandfather's laugh was`, [`loud and joyful`, `sudden and a little lonely`, `cruel`, `rehearsed`], 1, `A drawer opening in an empty house is a sudden sound in a quiet, lonely place.`),
      ],
    },
    { id: "WM", name: "Writing Mechanics", min: 7, tag: "M", qs: [
      Q(`Which sentence is punctuated correctly?`, [`The package which arrived late, was damaged.`, `The package, which arrived late was damaged.`, `The package, which arrived late, was damaged.`, `The package which, arrived late was damaged.`], 2, `"Which arrived late" is nonessential, so commas go on both sides.`),
      Q(`Each of the players ______ a uniform.`, [`have`, `has`, `are having`, `were`], 1, `"Each" is singular, so use "has."`),
      Q(`Which sentence uses a colon correctly?`, [`The recipe calls for: flour, sugar, and butter.`, `The recipe calls for three ingredients: flour, sugar, and butter.`, `The recipe: calls for three ingredients flour, sugar, and butter.`, `The recipe calls for three: ingredients flour, sugar, and butter.`], 1, `A colon follows a complete sentence and introduces the list.`),
      Q(`Which sentence uses the apostrophe correctly?`, [`The three sister's bedrooms were upstairs.`, `The three sisters bedrooms were upstairs.`, `The three sisters' bedrooms were upstairs.`, `The three sisters's bedrooms were upstairs.`], 2, `A plural noun ending in s takes only an apostrophe after the s.`),
      Q(`Between you and ______, the test was easy.`, [`I`, `me`, `myself`, `mine`], 1, `After the preposition "between," use the object pronoun "me."`),
      Q(`Which sentence is capitalized correctly?`, [`My Uncle lives near Lake Michigan, north of Chicago.`, `my uncle lives near lake Michigan.`, `My uncle lives near Lake Michigan, north of Chicago.`, `My uncle lives near Lake michigan north of chicago.`], 2, `"Uncle" is not capitalized when preceded by "my." Proper place names are capitalized.`),
      Q(`Which word is spelled INCORRECTLY?`, [`acquaintance`, `occassion`, `guarantee`, `maintenance`], 1, `The correct spelling is "occasion."`),
      Q(`She is taller ______ her brother, and ______ she smiled.`, [`then; than`, `than; then`, `than; than`, `then; then`], 1, `"Than" compares. "Then" shows time or sequence.`),
    ]},
    { id: "WC", name: "Writing Concepts and Skills", min: 7, tag: "C", qs: [
      Q(`Community gardens give neighbors fresh vegetables. They turn empty lots into green spaces. They also bring people together. Which topic sentence best introduces these details?`, [`Gardens need water.`, `Community gardens benefit neighborhoods in several ways.`, `Vegetables are healthy.`, `Empty lots are common in cities.`], 1, `B states the main idea that all three details support.`),
      Q(`Read: (1) Penguins spend much of their lives in the water. (2) Their flippers work like paddles. (3) My favorite color is green. (4) Their smooth feathers help them glide. Which sentence does NOT belong?`, [`Sentence 1`, `Sentence 2`, `Sentence 3`, `Sentence 4`], 2, `Sentence 3 is unrelated to penguins.`),
      Q(`Sofia studied for hours. ______, she felt confident on test day.`, [`However`, `Consequently`, `For example`, `Meanwhile`], 1, `The second sentence is a result, so "Consequently" fits.`),
      Q(`Which best combines these sentences? "The museum opens at nine. It closes at five. It is free on Sundays."`, [`The museum opens at nine, closes at five, it is free on Sundays.`, `The museum, which is free on Sundays, is open from nine to five.`, `Open from nine to five, and free on Sundays, the museum.`, `The museum opens, closes, and free.`], 1, `Choice B is correct, clear, and complete.`),
      Q(`Choose the best order. (1) Finally, ice cream is packed into containers. (2) First, cream and sugar are mixed together. (3) Next, the mixture is frozen while being stirred.`, [`1, 2, 3`, `2, 3, 1`, `3, 1, 2`, `2, 1, 3`], 1, `First, Next, Finally gives 2, 3, 1.`),
      Q(`Which is the best concluding sentence for a persuasive paragraph urging a school to start a composting program?`, [`That is all I have to say.`, `Starting a composting program would reduce waste, teach responsibility, and make our school a model for the community.`, `Compost is made from food.`, `Some schools have composting.`], 1, `A strong conclusion restates the main argument and leaves a final thought.`),
    ]},
    { id: "MA", name: "Mathematics", min: 28, tag: "N", qs: [
      Q(`What is 5/6 − 3/8?`, [`2/14`, `11/24`, `7/24`, `1/2`], 1, `20/24 − 9/24 = 11/24.`, "N"),
      Q(`What is 3.6 ÷ 0.12?`, [`3`, `30`, `300`, `0.3`], 1, `360 ÷ 12 = 30.`, "N"),
      Q(`What is 12.5% of 160?`, [`12.5`, `16`, `20`, `25`], 2, `12.5% = 1/8, and 160 ÷ 8 = 20.`, "N"),
      Q(`Paint is mixed in the ratio 2 parts blue to 3 parts yellow. How many liters of blue are in 35 liters of paint?`, [`10.5`, `14`, `21`, `7`], 1, `Blue is 2/5 of the mix: 2/5 × 35 = 14.`, "N"),
      Q(`A shirt's price drops from $64 to $48. What is the percent decrease?`, [`16%`, `20%`, `25%`, `33%`], 2, `The drop is $16. 16 ÷ 64 = 25%.`, "N"),
      Q(`What is the value of 4 + 3 × (8 − 2)² ÷ 9?`, [`12`, `16`, `28`, `52`], 1, `(8−2)² = 36. 3 × 36 = 108. 108 ÷ 9 = 12. 4 + 12 = 16.`, "A"),
      Q(`Solve 3(x − 4) = 2x + 5.`, [`1`, `9`, `17`, `21`], 2, `3x − 12 = 2x + 5 → x = 17.`, "A"),
      Q(`What is the greatest whole number that satisfies 2x + 3 ≤ 11?`, [`3`, `4`, `5`, `8`], 1, `2x ≤ 8, so x ≤ 4. The greatest whole number is 4.`, "A"),
      Q(`A triangle has a base of 14 cm and an area of 49 cm². What is its height?`, [`3.5 cm`, `7 cm`, `14 cm`, `28 cm`], 1, `½ × 14 × h = 49 → 7h = 49 → h = 7.`, "G"),
      Q(`The angles of a triangle are in the ratio 2 : 3 : 4. What is the largest angle?`, [`60°`, `80°`, `90°`, `100°`], 1, `1 part = 180 ÷ 9 = 20°. Largest = 4 × 20 = 80°.`, "G"),
      Q(`A rectangular tank is 40 cm long and 25 cm wide, and holds water to a depth of 12 cm. How many liters of water is that? (1 L = 1,000 cm³)`, [`1.2 L`, `12 L`, `120 L`, `4.8 L`], 1, `40 × 25 × 12 = 12,000 cm³ = 12 L.`, "G"),
      Q(`The mean of 8 numbers is 14. When the number 21 is removed, what is the mean of the remaining 7 numbers?`, [`13`, `13.5`, `14`, `14.5`], 0, `Total = 112. Without 21: 91. 91 ÷ 7 = 13.`, "D"),
      Q(`A bag has 5 red, 3 blue, and 2 green marbles. Two marbles are drawn without replacement. What is the probability that both are red?`, [`1/4`, `2/9`, `1/5`, `4/9`], 1, `5/10 × 4/9 = 20/90 = 2/9.`, "D"),
      Q(`Maria's age is 3 more than twice her brother's age. Their ages add to 33. How old is Maria?`, [`20`, `23`, `26`, `13`], 1, `b + (2b + 3) = 33 → 3b = 30 → b = 10. Maria = 2(10) + 3 = 23.`, "A"),
    ]},
  ],
};

const TEST2 = {
  id: "T2", name: "Practice Test 2: Dress Rehearsal", blurb: "64 questions, 7 sections, harder than the real thing on purpose",
  sections: [
    { id: "VR", name: "Verbal Reasoning", min: 10, tag: "V", qs: [
      Q(`Gregarious : hermit :: generous : ___`, [`donor`, `miser`, `friend`, `charity`], 1, `A gregarious (sociable) person is the opposite of a hermit. A generous person is the opposite of a miser.`),
      Q(`Cacophony : sound :: glare : ___`, [`light`, `shadow`, `eyes`, `mirror`], 0, `Cacophony is harsh, unpleasant sound. Glare is harsh, unpleasant light.`),
      Q(`Quarry : stone :: mine : ___`, [`ore`, `tunnel`, `miner`, `pickaxe`], 0, `A quarry is a place where stone is extracted. A mine is a place where ore is extracted.`),
      Q(`Hamper : help :: stifle : ___`, [`smother`, `express`, `cough`, `smile`], 1, `Hamper (to hinder) is the opposite of help. Stifle (to suppress) is the opposite of express.`),
      Q(`Which word does NOT belong? kilometer, hectare, fathom, furlong`, [`kilometer`, `hectare`, `fathom`, `furlong`], 1, `A hectare measures area. The others measure length.`),
      Q(`All pilots at the airline passed the exam. Rosa did not pass the exam. Which MUST be true?`, [`Rosa is a pilot who failed.`, `Rosa is not a pilot at the airline.`, `Rosa will pass later.`, `Nobody else failed.`], 1, `The contrapositive: if you are an airline pilot, you passed. Rosa did not pass, so she is not an airline pilot.`),
      Q(`Four houses stand in a row, numbered 1 to 4 from left to right. They are painted red, blue, green, and yellow. Red is not at either end. Blue is somewhere to the left of green. Yellow is immediately to the right of red. Which house number is blue?`, [`1`, `2`, `3`, `4`], 0, `Red is 2 or 3. If red is 2, yellow is 3, so blue and green fill 1 and 4 with blue on the left (blue 1). If red is 3, yellow is 4, so blue and green fill 1 and 2 (blue 1). Blue is house 1 either way.`),
      Q(`Her ______ manner, always consulting every detail twice, frustrated colleagues who preferred quick decisions.`, [`impulsive`, `fastidious`, `jovial`, `indifferent`], 1, `Fastidious means extremely careful about detail. "Impulsive" is the opposite of what the sentence describes.`),
    ]},
    { id: "QR", name: "Quantitative Reasoning", min: 12, tag: "Q", qs: [
      Q(`3, 4, 6, 9, 13, 18, ___`, [`22`, `23`, `24`, `25`], 2, `Differences are 1, 2, 3, 4, 5, so next is +6. 18 + 6 = 24.`),
      Q(`5, 10, 8, 16, 14, 28, ___`, [`26`, `30`, `56`, `24`], 0, `The rule alternates ×2 and −2. 28 − 2 = 26.`),
      Q(`1, 3, 7, 15, 31, ___`, [`47`, `62`, `63`, `64`], 2, `Double and add 1: 31 × 2 + 1 = 63.`),
      Q(`If 0 < x < 1, which of these is the greatest?`, [`x`, `x²`, `√x`, `1/x`], 3, `Try x = 0.25: x² = 0.0625, x = 0.25, √x = 0.5, 1/x = 4.`),
      Q(`A rule gives output = 2n² − 3. For which positive n is the output 29?`, [`3`, `4`, `5`, `16`], 1, `2n² = 32, so n² = 16 and n = 4.`),
      Q(`I add 7 to a number, multiply by 3, subtract 9, then divide by 6, and get 5. What was the number?`, [`4`, `6`, `8`, `10`], 1, `Work backward: 5 × 6 = 30, 30 + 9 = 39, 39 ÷ 3 = 13, 13 − 7 = 6.`),
      Q(`The sum of two numbers is 25 and their difference is 7. What is their product?`, [`112`, `126`, `144`, `150`], 2, `The numbers are (25+7)/2 = 16 and (25−7)/2 = 9. 16 × 9 = 144.`),
      Q(`A tower has 1 block in layer 1, 3 in layer 2, 5 in layer 3, 7 in layer 4, and so on. How many blocks are in a tower of 10 layers?`, [`19`, `90`, `100`, `110`], 2, `The sum of the first n odd numbers is n². 10² = 100.`),
    ]},
    { id: "VO", name: "Vocabulary", min: 8, tag: "W", qs: [
      Q(`The speaker's <u>eloquent</u> words moved the entire audience to tears.`, [`awkward`, `expressive and persuasive`, `short`, `confusing`], 1, `Eloquent means fluent and persuasive.`),
      Q(`The <u>ephemeral</u> beauty of the sunset lasted only minutes.`, [`short-lived`, `unusual`, `endless`, `frightening`], 0, `Ephemeral means lasting a very short time.`),
      Q(`Exhausted, the hikers felt <u>lethargic</u> by evening.`, [`sluggish`, `excited`, `angry`, `hungry`], 0, `Lethargic means lacking energy.`),
      Q(`The principal's <u>impartial</u> ruling favored neither side.`, [`harsh`, `biased`, `fair`, `slow`], 2, `Impartial means not favoring either side.`),
      Q(`The <u>ominous</u> clouds on the horizon warned of a storm.`, [`threatening`, `beautiful`, `thin`, `distant`], 0, `Ominous means suggesting something bad will happen.`),
      Q(`Be <u>discreet</u> about the surprise party. Do not tell anyone.`, [`excited`, `careful about what you say`, `loud`, `late`], 1, `Discreet means careful not to reveal or attract attention.`),
      Q(`Her <u>resilient</u> spirit helped her bounce back from every setback.`, [`able to recover quickly`, `easily upset`, `selfish`, `quiet`], 0, `Resilient means able to recover quickly.`),
      Q(`The scientist was <u>skeptical</u> of the claim until she saw the evidence.`, [`certain`, `doubtful`, `pleased`, `bored`], 1, `Skeptical means doubting.`),
      Q(`Which word means the OPPOSITE of <u>reluctant</u>?`, [`hesitant`, `unwilling`, `eager`, `tired`], 2, `Reluctant means unwilling. Eager is the opposite.`),
      Q(`A typewriter is now mostly <u>obsolete</u>.`, [`valuable`, `no longer used because of newer technology`, `fragile`, `unusual`], 1, `Obsolete means outdated and no longer in use.`),
    ]},
    { id: "RC", name: "Reading Comprehension", min: 20, tag: "R",
      passages: [
        { id: "T2A", title: "The Great Stink", text: [
          `In the summer of 1858, London was hit by a heat wave, and the River Thames began to cook. For years the city had poured its sewage straight into the river, and as the water dropped and the sun beat down, the smell grew so foul that newspapers dubbed the season the Great Stink. Members of Parliament, whose building stood on the riverbank, hung curtains soaked in chemicals over their windows, and some talked of moving the government out of the city.`,
          `The stench did more than offend noses. At the time, many people believed that diseases such as cholera spread through foul air. They were wrong about the cause, as doctors would later show that contaminated water was the real culprit, but their fear had a useful result. Within weeks, Parliament approved money for a massive sewer system designed by an engineer named Joseph Bazalgette.`,
          `Bazalgette's plan was to catch the city's waste in a network of underground brick tunnels and carry it miles downstream, far from where people lived and drew water. Construction took years and changed the face of London, from the embankments along the river to the pumping stations that lifted the waste along its route. Cholera outbreaks in the city soon faded. Remarkably, much of the system still serves London today, a century and a half after it was built.`,
        ]},
        { id: "T2B", title: "The Third Blue", text: [
          `Leila had painted the wall blue three times, and each time it had been wrong. The first was too cheerful, the sort of blue that belonged on a children's toy. The second sulked. The third, a deep, stormy shade she had mixed at midnight, looked magnificent until the morning sun struck it and turned it the color of a bruise.`,
          `"You could just ask the town council to pick," her brother offered from the doorway, balancing a sandwich on his knee. "They'd approve anything."`,
          `"They'd approve anything forgettable," Leila said. She did not turn around. The mural was for the community center, and the council had promised her a free hand, which she had come to understand was both a gift and a trap.`,
          `Her brother finished the sandwich, studied the wall for a long minute, and then did something unusual for him: he said nothing. He walked over, dipped a clean brush into the leftover third blue, and added a single streak of pale yellow along the bottom edge, where the wall met the ground.`,
          `Leila opened her mouth to object. Then she stepped back. The blue no longer looked like a bruise. It looked like the sky a few minutes after sunset, when the day is not quite finished and the night has not quite begun.`,
          `"Huh," she said.`,
          `"You're welcome," said her brother, and left her to it.`,
        ]},
      ],
      qs: [
        Qp(0, `Which statement best expresses the main idea of the passage?`, [`London's rivers have always been dangerous.`, `A smelly crisis, driven partly by a mistaken fear of disease, led London to build a lasting sewer system.`, `Joseph Bazalgette discovered the cause of cholera.`, `Parliament moved out of London in 1858.`], 1, `The passage traces the stink, the fear, and the long-lasting sewer system. Bazalgette designed the sewers but did not discover the cause of cholera, and Parliament did not move.`),
        Qp(0, `In the first paragraph, "dubbed" most nearly means`, [`insulted`, `named`, `ignored`, `ruined`], 1, `Newspapers "dubbed the season the Great Stink" means they gave it that nickname.`),
        Qp(0, `Why did the smell lead Parliament to act quickly?`, [`Lawmakers were personally affected and feared that foul air caused disease.`, `Newspapers demanded that Bazalgette be hired.`, `Doctors had proven that water spreads cholera.`, `The river had dried up.`], 0, `The second paragraph says many people believed foul air spread disease, and Parliament sat on the riverbank.`),
        Qp(0, `Which detail best shows that the sewer plan was a lasting success?`, [`Construction took years.`, `Parliament approved money within weeks.`, `Much of the system still serves London today.`, `The plan used brick tunnels.`], 2, `Continued use a century and a half later is evidence of lasting success.`),
        Qp(0, `What can be inferred about the "foul air" theory of disease?`, [`It was correct and saved London.`, `It was mistaken, but the fear it caused still led to a helpful result.`, `Doctors never questioned it.`, `It was invented by Bazalgette.`], 1, `The author says people "were wrong about the cause" but that their fear "had a useful result."`),
        Qp(1, `"A gift and a trap" suggests that the council's promise of a free hand gave Leila`, [`freedom to create, along with pressure from having no guidance`, `a large budget and a deadline`, `an assistant and an opponent`, `more paint than she needed`], 0, `A free hand is a gift (freedom) and a trap (no one to blame or guide her if she gets it wrong).`),
        Qp(1, `Why does Leila reject her brother's first suggestion?`, [`She wants the mural to be memorable and not merely acceptable.`, `She dislikes the town council.`, `She is angry at her brother.`, `She has run out of paint.`], 0, `"They'd approve anything forgettable" shows she wants something memorable.`),
        Qp(1, `The sentence "The second sulked" is an example of`, [`simile`, `personification`, `hyperbole`, `idiom`], 1, `Giving a color the human behavior of sulking is personification.`),
        Qp(1, `What does the yellow streak accomplish?`, [`It covers the bruise-like color completely.`, `It changes how the blue looks, making it resemble the sky just after sunset.`, `It spells a message.`, `It makes the wall cheerful and bright.`], 1, `The text says the blue no longer looked like a bruise but like dusk.`),
        Qp(1, `Which phrase best describes Leila's brother?`, [`sarcastic and impatient`, `perceptive and quietly helpful`, `bossy and competitive`, `shy and nervous`], 1, `He studies the wall, says nothing, and solves the problem with a single stroke.`),
      ],
    },
    { id: "WM", name: "Writing Mechanics", min: 7, tag: "M", qs: [
      Q(`Which sentence is punctuated correctly?`, [`The tired hungry hikers finally reached the cabin but the door was locked.`, `The tired, hungry hikers finally reached the cabin, but the door was locked.`, `The tired, hungry, hikers finally reached the cabin but, the door was locked.`, `The tired hungry hikers, finally reached the cabin, but the door was locked.`], 1, `Commas separate coordinate adjectives and come before "but" joining two sentences.`),
      Q(`Which sentence uses quotation marks and punctuation correctly?`, [`"Where are you going?" asked Mia.`, `"Where are you going," asked Mia?`, `"Where are you going?", asked Mia.`, `"Where are you going" asked Mia.`], 0, `The question mark stays inside the quotation marks, and no comma follows it.`),
      Q(`A bouquet of red roses ______ on the table.`, [`were`, `was`, `are`, `have been`], 1, `The subject is "bouquet" (singular).`),
      Q(`She is the student ______ I believe won the award.`, [`whom`, `who`, `whose`, `which`], 1, `Remove "I believe": "She is the student who won the award." "Who" is the subject of "won."`),
      Q(`Which sentence uses hyphens correctly?`, [`The twelve-year-old student won.`, `The twelve year old student won.`, `The twelve-year old-student won.`, `The twelve year-old student won.`], 0, `A compound modifier before a noun is hyphenated: twelve-year-old.`),
      Q(`The glass had ______ off the shelf before anyone noticed.`, [`fell`, `fallen`, `falled`, `falling`], 1, `"Had" takes the past participle "fallen."`),
      Q(`Which word is spelled correctly?`, [`privelege`, `priviledge`, `privilege`, `privlege`], 2, `The correct spelling is "privilege."`),
      Q(`Which sentence is punctuated correctly?`, [`The movie was long; however, we enjoyed it.`, `The movie was long however, we enjoyed it.`, `The movie was long, however we enjoyed it.`, `The movie was long; however we enjoyed it.`], 0, `A semicolon before "however" and a comma after it joins two sentences correctly.`),
    ]},
    { id: "WC", name: "Writing Concepts and Skills", min: 7, tag: "C", qs: [
      Q(`Reading every day builds vocabulary. It improves concentration. It also helps students write better. Which topic sentence best introduces these details?`, [`Books can be found at libraries.`, `Daily reading benefits students in several important ways.`, `Some students do not like reading.`, `Writing is a skill.`], 1, `B names the main idea all three details support.`),
      Q(`Read: (1) Emperor penguins huddle together to stay warm. (2) They take turns standing on the outside of the group. (3) I once saw a movie about snow. (4) This sharing of warmth helps the whole group survive. Which sentence does NOT belong?`, [`Sentence 1`, `Sentence 2`, `Sentence 3`, `Sentence 4`], 2, `Sentence 3 is not about how penguins stay warm.`),
      Q(`Plastic bags are cheap to make. ______, they cause serious problems for wildlife.`, [`Likewise`, `For example`, `However`, `Finally`], 2, `The second sentence contrasts with the first.`),
      Q(`Which best combines these? "The cheetah is the fastest land animal. It can reach speeds over 60 miles per hour."`, [`The cheetah, the fastest land animal, can reach speeds over 60 miles per hour.`, `The cheetah the fastest land animal can reach speeds over 60 miles per hour.`, `The cheetah is the fastest land animal, can reach speeds over 60 miles per hour.`, `Fastest land animal, the cheetah is over 60 miles per hour.`], 0, `The appositive is set off with commas.`),
      Q(`Which revision is the most concise?`, [`The reason why I was late is because the bus broke down.`, `I was late because the bus broke down.`, `The reason I was late was due to the fact that the bus broke down.`, `Being late was because of the bus breaking down.`], 1, `Choice B removes the repetition.`),
      Q(`Which is the best concluding sentence for a persuasive essay urging a school to start a recycling program?`, [`In conclusion, that is my essay.`, `Recycling is a thing.`, `By starting a recycling program, our school can cut waste, save money, and set an example for the whole town.`, `Some schools recycle and some do not.`], 2, `A strong conclusion restates the main argument and leaves a final thought.`),
    ]},
    { id: "MA", name: "Mathematics", min: 28, tag: "N", qs: [
      Q(`What is 2 1/3 × 1 4/7?`, [`3 2/3`, `2 4/21`, `3 4/21`, `4`], 0, `7/3 × 11/7 = 11/3 = 3 2/3.`, "N"),
      Q(`What is 0.9 ÷ 0.045?`, [`2`, `20`, `200`, `0.2`], 1, `900 ÷ 45 = 20.`, "N"),
      Q(`What is 35% of 240?`, [`72`, `84`, `96`, `105`], 1, `10% = 24, so 30% = 72 and 5% = 12. 72 + 12 = 84.`, "N"),
      Q(`A recipe uses 3 cups of flour for every 2 cups of sugar. If Sam uses 7.5 cups of flour, how many cups of sugar does he need?`, [`4`, `5`, `6`, `11.25`], 1, `7.5 ÷ 3 = 2.5 batches. 2.5 × 2 = 5 cups.`, "N"),
      Q(`A town's population grew from 800 to 1,000. Then it fell by 20%. What is the final population?`, [`800`, `900`, `1,000`, `1,200`], 0, `20% of 1,000 is 200. 1,000 − 200 = 800.`, "N"),
      Q(`What is (12 − 4)² ÷ 2³ + 5 × 2?`, [`14`, `18`, `26`, `42`], 1, `64 ÷ 8 = 8, then 5 × 2 = 10. 8 + 10 = 18.`, "A"),
      Q(`Solve 4(2x − 1) = 6x + 10.`, [`3`, `5`, `7`, `14`], 2, `8x − 4 = 6x + 10 → 2x = 14 → x = 7.`, "A"),
      Q(`Simplify 5(2a − 3) − 3(a − 4).`, [`7a − 27`, `7a − 3`, `13a − 3`, `7a + 3`], 1, `10a − 15 − 3a + 12 = 7a − 3.`, "A"),
      Q(`A parallelogram has a base of 9 cm and an area of 63 cm². What is its height?`, [`5 cm`, `6 cm`, `7 cm`, `8 cm`], 2, `63 ÷ 9 = 7.`, "G"),
      Q(`Two angles are complementary. One is 12° more than twice the other. What is the larger angle?`, [`26°`, `38°`, `52°`, `64°`], 3, `Let the smaller be s. s + (2s + 12) = 90 → s = 26. The larger is 2(26) + 12 = 64°.`, "G"),
      Q(`What is the surface area of a rectangular prism measuring 4 cm by 3 cm by 2 cm?`, [`24 cm²`, `26 cm²`, `52 cm²`, `48 cm²`], 2, `2(4×3 + 4×2 + 3×2) = 2(12 + 8 + 6) = 52.`, "G"),
      Q(`Seven students scored 72, 85, 85, 90, 78, 85, and 95. Which statement is true?`, [`The mean is greater than the median.`, `The mean equals the median.`, `The median equals the mode.`, `The mean equals the mode.`], 2, `Sorted: 72, 78, 85, 85, 85, 90, 95. Median = 85 and mode = 85. The mean is 590 ÷ 7 ≈ 84.3.`, "D"),
      Q(`A number cube is rolled twice. What is the probability of getting at least one 6?`, [`1/3`, `1/6`, `11/36`, `5/18`], 2, `P(no 6) = 5/6 × 5/6 = 25/36. So P(at least one 6) = 1 − 25/36 = 11/36.`, "D"),
      Q(`Pipe A fills a tank in 6 hours and pipe B fills it in 3 hours. How long do they take together?`, [`1.5 hours`, `2 hours`, `4.5 hours`, `9 hours`], 1, `Rates: 1/6 + 1/3 = 1/2 of the tank per hour, so it takes 2 hours.`, "N"),
    ]},
  ],
};

const TESTS = [TEST1, TEST2];

/* ===================== PLAN, INDEXES, CHEAT SHEET ===================== */
const START = new Date(2026, 9, 15);      // Thu, Oct 15, 2026
const TEST_DATE = new Date(2026, 9, 29);  // assumed test day (2 weeks out)
const DAY_MS = 86400000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const T = (k, ref, m) => ({ k, ref, m });
const PLAN = [
  { title: "Verbal Reasoning", tasks: [T("lesson","V1",12), T("lesson","V2",10), T("lesson","V3",13), T("quiz","V",15), T("flash","0-10",10)] },
  { title: "Quantitative Reasoning", tasks: [T("lesson","Q1",12), T("lesson","Q2",10), T("lesson","Q3",10), T("quiz","Q",15), T("flash","10-20",8), T("weak","",5)] },
  { title: "Fractions, Ratios, Percents", tasks: [T("lesson","N1",15), T("lesson","N2",15), T("lesson","N3",15), T("lesson","N4",15), T("quiz","N",25), T("flash","20-30",10), T("challenge","",20), T("weak","",5)] },
  { title: "Practice Test 1 (checkpoint)", tasks: [T("test","T1",92), T("review","T1",28)] },
  { title: "Vocabulary", tasks: [T("review","T1",8), T("lesson","W1",12), T("lesson","W2",13), T("lesson","W3",12), T("quiz","W",15)] },
  { title: "Reading Comprehension", tasks: [T("lesson","R1",12), T("lesson","R2",13), T("lesson","R3",15), T("quiz","R",20)] },
  { title: "Writing Mechanics", tasks: [T("lesson","M1",15), T("lesson","M2",18), T("lesson","M3",12), T("quiz","M",15)] },
  { title: "Writing Concepts + Words", tasks: [T("lesson","C1",10), T("lesson","C2",12), T("lesson","C3",12), T("quiz","C",12), T("flash","30-40",14)] },
  { title: "Algebra", tasks: [T("lesson","A1",12), T("lesson","A2",12), T("lesson","A3",16), T("quiz","A",20)] },
  { title: "Geometry and Data", tasks: [T("lesson","G1",12), T("lesson","G2",10), T("lesson","G3",13), T("quiz","G",15), T("lesson","D1",12), T("lesson","D2",10), T("lesson","D3",13), T("quiz","D",15), T("flash","40-50",10), T("weak","",10)] },
  { title: "Practice Test 2 (dress rehearsal)", tasks: [T("test","T2",92), T("review","T2",28)] },
  { title: "Fix the weak spots", tasks: [T("weak","",25), T("review","T2",20), T("flash","learning",15)] },
  { title: "Challenge day", tasks: [T("challenge","",30), T("weak","",20), T("flash","50-62",10)] },
  { title: "Light review and rest", tasks: [T("cheat","",20), T("flash","learning",20), T("weakest","",15), T("rest","",5)] },
].map((d, i) => ({ ...d, i, date: new Date(START.getTime() + i * DAY_MS), mins: d.tasks.reduce((a, t) => a + t.m, 0) }));

const MOD_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m]));
const LESSON_BY_ID = {};
MODULES.forEach((m) => m.lessons.forEach((l) => { LESSON_BY_ID[l.id] = { ...l, mod: m }; }));

// Attach ids and passages to every question
MODULES.forEach((m) => {
  m.quiz = m.quiz.map((q, i) => ({ ...q, id: `${m.id}-q${i + 1}`, mod: m.id, pass: q.p !== undefined && m.passages ? m.passages[q.p] : null }));
});
TESTS.forEach((t) => {
  t.sections.forEach((s) => {
    s.qs = s.qs.map((q, i) => ({ ...q, id: `${t.id}-${s.id}-${i + 1}`, sec: s.id, tag: q.tag || s.tag, pass: q.p !== undefined && s.passages ? s.passages[q.p] : null }));
  });
  t.total = t.sections.reduce((a, s) => a + s.qs.length, 0);
  t.minutes = t.sections.reduce((a, s) => a + s.min, 0);
});
const ALLQ = {};
MODULES.forEach((m) => m.quiz.forEach((q) => { ALLQ[q.id] = q; }));
TESTS.forEach((t) => t.sections.forEach((s) => s.qs.forEach((q) => { ALLQ[q.id] = q; })));
const TOTAL_LESSONS = MODULES.reduce((a, m) => a + m.lessons.length, 0);

const TAG_NAMES = { V: "Verbal reasoning", Q: "Quantitative reasoning", W: "Vocabulary", R: "Reading", M: "Writing mechanics", C: "Writing concepts", N: "Fractions, ratios, percents", A: "Algebra", G: "Geometry", D: "Data and probability" };

const CHEAT = [
  { h: "Math formulas", items: [
    "Rectangle: A = lw. Triangle: A = ½bh. Parallelogram: A = bh. Trapezoid: A = ½(b₁ + b₂)h.",
    "Circle: C = 2πr, A = πr² (π ≈ 3.14).",
    "Rectangular prism: V = lwh. Surface area = sum of all 6 faces.",
    "Scale by k: lengths × k, areas × k², volumes × k³.",
    "Triangle angles sum to 180°. Quadrilateral angles sum to 360°. Supplementary = 180°, complementary = 90°.",
    "Mean = sum ÷ count. Needed total = target mean × count.",
    "Percent change = (new − old) ÷ old. Successive percents multiply.",
    "Probability = favorable ÷ total. P(not A) = 1 − P(A). Counting: multiply the choices.",
    "1 m = 100 cm, 1 km = 1,000 m, 1 L = 1,000 cm³.",
    "Order of operations: parentheses, exponents, × ÷ (left to right), + − (left to right).",
  ]},
  { h: "Number sense", items: [
    "Divide fractions: keep, change, flip. Convert mixed numbers first.",
    "Divide decimals: shift both decimal points the same number of places.",
    "Fractions to decimals: 1/8 = 0.125, 1/3 ≈ 0.333, 2/3 ≈ 0.667, 5/8 = 0.625, 7/12 ≈ 0.583.",
    "Powers: 2⁵ = 32, 2¹⁰ = 1,024, 3⁴ = 81, 4³ = 64, 5³ = 125.",
    "GCF uses shared primes (lowest powers). LCM uses all primes (highest powers).",
  ]},
  { h: "Reasoning", items: [
    "Analogy: make a bridge sentence, then test every choice.",
    "Odd one out: find the narrowest category that fits three words.",
    "'All A are B' does not mean 'all B are A.' Contrapositive of 'if P then Q' is 'if not Q then not P.'",
    "Pattern: check differences, differences of differences, ratios, two-step rules, then interleaving.",
    "With variables, test 0, 1, a fraction, and a negative.",
  ]},
  { h: "Grammar and punctuation", items: [
    "Comma after an introductory clause. Commas around nonessential information.",
    "Semicolon joins two complete sentences. Colon follows a complete sentence.",
    "its = belongs to it. it's = it is. affect = verb, effect = noun. than = comparison, then = time.",
    "Subject-verb agreement: ignore the prepositional phrase. Neither/nor: agree with the nearer subject.",
    "Between you and me. Marcus and I. Who = subject, whom = object.",
    "Parallel lists: all -ing, or all to-verbs. Fix fragments and comma splices.",
  ]},
  { h: "Reading and writing", items: [
    "Main idea covers the whole passage. Wrong choices are too narrow or too broad.",
    "Inference: choose the answer you can prove with a line from the text. Avoid always, never, only.",
    "Purpose: inform, persuade, entertain. Tone shows in word choice.",
    "Topic sentence = main idea. Remove sentences that wander off topic.",
    "Transitions: contrast (however), result (therefore), example (for instance), sequence (first, next, finally).",
    "Concise beats wordy. Specific beats vague. Formal writing avoids slang.",
  ]},
  { h: "Vocabulary strategy", items: [
    "Cover the word, predict your own, then match.",
    "Contrast signals: but, although, however, despite, unlike.",
    "Roots: bene (good), mal (bad), rupt (break), dict (say), port (carry), spec (look), scrib/script (write), struct (build), vol (wish), chron (time).",
    "Prefixes: anti-, circum- (around), inter- (between), sub-, trans-, uni- (one), un-/in-/dis- (not).",
  ]},
  { h: "Test-day strategy", items: [
    "Sleep well and eat breakfast. Bring what the school says to bring.",
    "Read the whole question and every choice. Cross out wrong choices first.",
    "If stuck for more than a minute, make your best guess, flag it, and move on.",
    "In reading, find the line that proves your answer.",
    "In math, write steps on scratch paper and check units.",
    "Use the last minute to check that answers match the right question numbers.",
  ]},
];

/* ---------- helpers ---------- */
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
function todayIdx() {
  const diff = Math.round((startOfDay(new Date()) - startOfDay(START)) / DAY_MS);
  return clamp(diff, 0, 13);
}
function daysToTest() {
  return Math.round((startOfDay(TEST_DATE) - startOfDay(new Date())) / DAY_MS);
}
const fmtDate = (d) => `${WEEKDAYS[d.getDay()]}, ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
const shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct = (c, t) => (t ? Math.round((c / t) * 100) : 0);
const clone = (o) => JSON.parse(JSON.stringify(o));
const EMPTY = { lessons: {}, quiz: {}, tests: {}, missed: {}, flash: {}, tasks: {}, untimed: false };

const STORE_KEY = "arjun-ctp5-v1";
async function loadProgress() {
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) { /* storage blocked */ }
  try {
    if (typeof window !== "undefined" && window.storage) {   // Claude artifact fallback
      const r = await window.storage.get(STORE_KEY);
      return r && r.value ? JSON.parse(r.value) : null;
    }
  } catch (e) { /* none */ }
  return null;
}
async function saveProgress(p) {
  const raw = JSON.stringify(p);
  try { if (typeof localStorage !== "undefined") localStorage.setItem(STORE_KEY, raw); } catch (e) { /* blocked */ }
  try { if (typeof window !== "undefined" && window.storage) await window.storage.set(STORE_KEY, raw); } catch (e) { /* none */ }
}

function richHtml(s) {
  return String(s).replace(/<(?!\/?(u|i)>)/g, "&lt;");
}
function taskLabel(t) {
  switch (t.k) {
    case "lesson": return `Lesson: ${LESSON_BY_ID[t.ref].title}`;
    case "quiz": return `Quiz: ${MOD_BY_ID[t.ref].name}`;
    case "test": return `Take ${TESTS.find((x) => x.id === t.ref).name}`;
    case "review": return `Review mistakes: ${TESTS.find((x) => x.id === t.ref).name.split(":")[0]}`;
    case "flash": { if (t.ref === "learning") return "Flashcards: words you are still learning"; const [a, b] = t.ref.split("-").map(Number); return `Flashcards: words ${a + 1} to ${b}`; }
    case "weak": return "Weak-spot drill (your missed questions)";
    case "challenge": return "Challenge round (20 mixed, hardest)";
    case "cheat": return "Read the cheat sheet";
    case "weakest": return "Retake your lowest-scoring quiz";
    case "rest": return "Pack up, relax, early bedtime";
    default: return t.k;
  }
}
function isTaskDone(t, key, P) {
  if (P.tasks[key]) return true;
  if (t.k === "lesson") return !!P.lessons[t.ref];
  if (t.k === "quiz") return !!P.quiz[t.ref];
  if (t.k === "test") return !!P.tests[t.ref];
  return false;
}

/* ===================== STYLES ===================== */
const CSS = `
.ap{--bg:#f5f6fb;--card:#fff;--ink:#0f1730;--muted:#586282;--line:#dde1ee;--brand:#3b2fe0;--brand-ink:#fff;--soft:#eceefc;--gold:#ffb400;--good:#0b8f63;--good-bg:#e3f6ee;--bad:#d6393f;--bad-bg:#fde8e9;--warn-bg:#fff4d6;
  background:var(--bg);color:var(--ink);min-height:100vh;font-family:"Avenir Next","Segoe UI",system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.5}
@media (prefers-color-scheme: dark){.ap{--bg:#0c0f1e;--card:#151a2f;--ink:#eef0ff;--muted:#9aa3c9;--line:#2a3154;--brand:#8c85ff;--brand-ink:#0c0f1e;--soft:#1d2342;--gold:#ffc83d;--good:#37c88f;--good-bg:#10332a;--bad:#ff7075;--bad-bg:#3a1b21;--warn-bg:#3a3217}}
.ap *{box-sizing:border-box}
.ap button{font-family:inherit;font-size:inherit;cursor:pointer}
.wrap{max-width:900px;margin:0 auto;padding:18px 16px 60px}
.top{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:10px}
.brand{font-size:26px;font-weight:800;letter-spacing:-.02em;margin:0;line-height:1.1}
.sub{color:var(--muted);font-size:14px;margin:2px 0 0}
.chip{background:var(--soft);border-radius:999px;padding:6px 12px;font-weight:700;font-size:14px;white-space:nowrap}
.chip b{color:var(--brand)}
.nav{display:flex;gap:4px;overflow-x:auto;border-bottom:1px solid var(--line);margin-bottom:16px}
.nav button{background:none;border:0;padding:10px 12px;font-weight:700;color:var(--muted);border-bottom:3px solid transparent;white-space:nowrap}
.nav button.on{color:var(--brand);border-bottom-color:var(--brand)}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:14px}
.card h2,.card h3{margin:0 0 6px}
h2.sec{font-size:20px;margin:18px 0 8px;letter-spacing:-.01em}
.btn{background:var(--brand);color:var(--brand-ink);border:0;border-radius:10px;padding:10px 16px;font-weight:700}
.btn:disabled{opacity:.45;cursor:not-allowed}
.btn.ghost{background:transparent;color:var(--brand);border:1.5px solid var(--brand)}
.btn.sm{padding:6px 12px;font-size:14px;border-radius:8px}
.btn.good{background:var(--good);color:#fff}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.spread{justify-content:space-between}
.muted{color:var(--muted)}
.small{font-size:14px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (max-width:620px){.grid2{grid-template-columns:1fr}}
.bar{height:8px;background:var(--soft);border-radius:99px;overflow:hidden}
.bar>i{display:block;height:100%;background:var(--brand);border-radius:99px}
.bar.good>i{background:var(--good)}
.bar.bad>i{background:var(--bad)}
/* training strip: bar height = hours of study that day */
.strip{display:flex;gap:4px;align-items:flex-end;overflow-x:auto;padding:6px 2px 4px}
.day{flex:1 1 0;min-width:0;background:none;border:0;padding:0;text-align:center;color:var(--ink)}
.day .col{position:relative;width:100%;border-radius:10px 10px 6px 6px;background:var(--soft);overflow:hidden;border:2px solid transparent}
.day .col i{position:absolute;left:0;right:0;bottom:0;background:var(--brand);opacity:.9}
.day .col em{position:absolute;top:5px;left:0;right:0;font-style:normal;font-size:10px;font-weight:800;color:var(--muted)}
.day.sel .col{border-color:var(--ink)}
.day .lab{font-size:10px;margin-top:4px;line-height:1.15;color:var(--muted);overflow:hidden}
.day .lab b{display:block;font-size:13px;color:var(--ink)}
.day.today .lab b::after{content:"";display:block;width:6px;height:6px;border-radius:50%;background:var(--gold);margin:2px auto 0}
.task{display:flex;gap:12px;align-items:center;padding:10px 0;border-top:1px solid var(--line)}
.task:first-of-type{border-top:0}
.task .ck{width:24px;height:24px;border-radius:7px;border:2px solid var(--line);background:var(--card);display:grid;place-items:center;flex:0 0 24px;color:#fff;font-weight:900;padding:0}
.task.done .ck{background:var(--good);border-color:var(--good)}
.task.done .tl{color:var(--muted);text-decoration:line-through}
.task .tl{flex:1;font-weight:600}
.task .mn{color:var(--muted);font-size:13px;white-space:nowrap}
.mod{display:block;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-left:6px solid var(--c);border-radius:12px;padding:12px 14px;color:var(--ink)}
.mod b{font-size:17px}
.lesson{font-family:Georgia,"Iowan Old Style",serif;font-size:17.5px;line-height:1.7;max-width:680px}
.lesson p{margin:0 0 12px}
.lesson h4{font-family:"Avenir Next","Segoe UI",system-ui,sans-serif;margin:18px 0 6px;font-size:16px}
.lesson ul{margin:0 0 12px;padding-left:22px}
.lesson li{margin-bottom:5px}
.ex,.tip,.trap{border-radius:10px;padding:12px 14px;margin:14px 0;font-size:16.5px;line-height:1.6;font-family:"Avenir Next","Segoe UI",system-ui,sans-serif}
.ex{background:var(--soft);border-left:5px solid var(--brand)}
.tip{background:var(--good-bg);border-left:5px solid var(--good)}
.trap{background:var(--warn-bg);border-left:5px solid var(--gold)}
.ex .k,.tip .k,.trap .k{font-weight:800;margin-right:6px}
.pass{font-family:Georgia,"Iowan Old Style",serif;background:var(--soft);border-left:5px solid var(--brand);border-radius:0 10px 10px 0;padding:12px 16px 2px;margin-bottom:14px;max-height:340px;overflow:auto;line-height:1.65;font-size:16.5px}
.pass h4{font-family:"Avenir Next","Segoe UI",system-ui,sans-serif;margin:0 0 6px}
.pass p{margin:0 0 10px}
.qtext{font-size:18px;font-weight:600;margin:4px 0 12px}
.qtext u{text-decoration-thickness:2px;text-underline-offset:3px}
.opt{display:flex;gap:10px;width:100%;text-align:left;background:var(--card);border:2px solid var(--line);border-radius:12px;padding:11px 12px;margin-bottom:8px;color:var(--ink);align-items:flex-start}
.opt .lt{flex:0 0 26px;height:26px;border-radius:50%;background:var(--soft);display:grid;place-items:center;font-weight:800;font-size:13px}
.opt.sel{border-color:var(--brand);background:var(--soft)}
.opt.sel .lt{background:var(--brand);color:var(--brand-ink)}
.opt.ok{border-color:var(--good);background:var(--good-bg)}
.opt.ok .lt{background:var(--good);color:#fff}
.opt.no{border-color:var(--bad);background:var(--bad-bg)}
.opt.no .lt{background:var(--bad);color:#fff}
.opt:disabled{cursor:default}
.expl{background:var(--soft);border-radius:10px;padding:10px 12px;margin:6px 0 12px;font-size:15.5px}
.nums{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 14px}
.nums button{width:36px;height:36px;border-radius:9px;border:2px solid var(--line);background:var(--card);color:var(--ink);font-weight:700;padding:0}
.nums button.ans{background:var(--soft);border-color:var(--brand)}
.nums button.flag{border-color:var(--gold);box-shadow:inset 0 -4px 0 var(--gold)}
.nums button.cur{outline:3px solid var(--ink);outline-offset:1px}
.timer{font-variant-numeric:tabular-nums;font-weight:800;font-size:20px;padding:4px 12px;border-radius:10px;background:var(--soft)}
.timer.low{background:var(--bad-bg);color:var(--bad)}
.big{font-size:44px;font-weight:800;letter-spacing:-.02em;line-height:1}
.flash{min-height:210px;display:grid;place-items:center;text-align:center;background:var(--card);border:2px solid var(--line);border-radius:18px;padding:22px;width:100%;color:var(--ink)}
.flash .w{font-size:34px;font-weight:800;letter-spacing:-.01em}
.flash .d{font-size:20px;font-weight:600}
.flash .s{font-family:Georgia,serif;font-style:italic;color:var(--muted);margin-top:10px}
.pill{display:inline-block;padding:2px 9px;border-radius:99px;font-size:12.5px;font-weight:800;background:var(--soft);color:var(--brand);margin-right:6px}
.pill.g{background:var(--good-bg);color:var(--good)}
.pill.r{background:var(--bad-bg);color:var(--bad)}
.ci{margin:0 0 6px;padding-left:20px}
.ci li{margin-bottom:5px}
.tbl{width:100%;border-collapse:collapse;font-size:15px}
.tbl td,.tbl th{padding:8px 6px;border-top:1px solid var(--line);text-align:left}
.tbl th{border-top:0;color:var(--muted);font-size:13px}
.note{font-size:13px;color:var(--muted)}
`;

/* ===================== SMALL PIECES ===================== */
const Rich = ({ html, className }) => <span className={className} dangerouslySetInnerHTML={{ __html: richHtml(html) }} />;

function Passage({ pass }) {
  if (!pass) return null;
  return (
    <div className="pass">
      <h4>{pass.title}</h4>
      {pass.text.map((t, i) => <p key={i}>{t}</p>)}
    </div>
  );
}

function Options({ q, sel, onPick, reveal }) {
  return (
    <div>
      {q.o.map((o, k) => {
        let cls = "opt";
        if (reveal) { if (k === q.a) cls += " ok"; else if (k === sel) cls += " no"; }
        else if (k === sel) cls += " sel";
        return (
          <button key={k} className={cls} disabled={reveal} onClick={() => onPick(k)}>
            <span className="lt">{"ABCD"[k]}</span>
            <Rich html={o} />
          </button>
        );
      })}
    </div>
  );
}

function Block({ b }) {
  const [open, setOpen] = useState(false);
  if (b.t === "p") return <p>{b.x}</p>;
  if (b.t === "h") return <h4>{b.x}</h4>;
  if (b.t === "l") return <ul>{b.x.map((x, i) => <li key={i}>{x}</li>)}</ul>;
  if (b.t === "tip") return <div className="tip"><span className="k">Tip:</span>{b.x}</div>;
  if (b.t === "trap") return <div className="trap"><span className="k">Watch out:</span>{b.x}</div>;
  if (b.t === "ex") return (
    <div className="ex">
      <div><span className="k">Try it:</span>{b.q}</div>
      {open ? <div style={{ marginTop: 8 }}><span className="k">Solution:</span>{b.s}</div>
        : <button className="btn sm ghost" style={{ marginTop: 8 }} onClick={() => setOpen(true)}>Show solution</button>}
    </div>
  );
  return null;
}

/* ===================== QUIZ RUNNER ===================== */
function QuizRunner({ title, qs, onDone, onExit, onRetry }) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(null);
  const [checked, setChecked] = useState(false);
  const [log, setLog] = useState([]);
  const [finished, setFinished] = useState(false);
  const q = qs[i];

  useEffect(() => { if (finished && onDone) onDone(log); }, [finished]);

  if (!qs.length) return <div className="card"><p>No questions here yet.</p><button className="btn" onClick={onExit}>Back</button></div>;

  if (finished) {
    const right = log.filter((l) => l.ok).length;
    const wrong = log.filter((l) => !l.ok);
    return (
      <div>
        <div className="card">
          <div className="muted small">{title}</div>
          <div className="big" style={{ margin: "6px 0" }}>{right}/{qs.length}</div>
          <div className="bar good" style={{ marginBottom: 10 }}><i style={{ width: pct(right, qs.length) + "%" }} /></div>
          <p style={{ margin: "0 0 10px" }}>{pct(right, qs.length) >= 80 ? "Strong work. Check the misses below, then move on." : pct(right, qs.length) >= 60 ? "Solid start. Read each explanation below, then retry the misses." : "These are meant to be hard. Re-read the lesson, study the explanations below, and retry."}</p>
          <div className="row">
            {wrong.length > 0 && <button className="btn" onClick={() => onRetry(wrong.map((w) => w.id))}>Retry the {wrong.length} I missed</button>}
            <button className="btn ghost" onClick={onExit}>Done</button>
          </div>
        </div>
        {wrong.length > 0 && <h2 className="sec">What you missed</h2>}
        {wrong.map((w) => { const qq = ALLQ[w.id]; return (
          <div className="card" key={w.id}>
            {qq.pass && <div className="note">Passage: {qq.pass.title}</div>}
            <div className="qtext"><Rich html={qq.q} /></div>
            <div className="small"><span className="pill r">Your answer</span><Rich html={qq.o[w.sel]} /></div>
            <div className="small" style={{ marginTop: 4 }}><span className="pill g">Correct</span><Rich html={qq.o[qq.a]} /></div>
            <div className="expl">{qq.e}</div>
          </div>
        ); })}
      </div>
    );
  }

  const check = () => { if (sel === null) return; setChecked(true); setLog((l) => [...l, { id: q.id, sel, ok: sel === q.a }]); };
  const next = () => { if (i + 1 >= qs.length) setFinished(true); else { setI(i + 1); setSel(null); setChecked(false); } };

  return (
    <div>
      <div className="row spread" style={{ marginBottom: 8 }}>
        <div><b>{title}</b> <span className="muted small">Question {i + 1} of {qs.length}</span></div>
        <button className="btn sm ghost" onClick={onExit}>Exit</button>
      </div>
      <div className="bar" style={{ marginBottom: 14 }}><i style={{ width: (i / qs.length) * 100 + "%" }} /></div>
      <div className="card">
        <Passage pass={q.pass} />
        <div className="qtext"><Rich html={q.q} /></div>
        <Options q={q} sel={sel} onPick={(k) => { if (!checked) setSel(k); }} reveal={checked} />
        {checked && <div className="expl"><b>{sel === q.a ? "Correct. " : "Not quite. "}</b>{q.e}</div>}
        <div className="row" style={{ marginTop: 6 }}>
          {!checked ? <button className="btn" disabled={sel === null} onClick={check}>Check answer</button>
            : <button className="btn" onClick={next}>{i + 1 >= qs.length ? "See results" : "Next question"}</button>}
        </div>
      </div>
    </div>
  );
}

/* ===================== TEST RUNNER ===================== */
const fmtTime = (s) => { s = Math.max(0, s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

function TestRunner({ test, untimed, onFinish, onExit }) {
  const [phase, setPhase] = useState("intro");
  const [timed, setTimed] = useState(!untimed);
  const [si, setSi] = useState(0);
  const [qi, setQi] = useState(0);
  const [ans, setAns] = useState({});
  const [flags, setFlags] = useState({});
  const [left, setLeft] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [leave, setLeave] = useState(false);
  const sec = test.sections[si];
  const q = sec.qs[qi];

  const endSection = () => {
    setConfirm(false);
    if (si + 1 >= test.sections.length) setPhase("done"); else setPhase("between");
  };
  const startSection = (idx) => { setSi(idx); setQi(0); setLeft(test.sections[idx].min * 60); setConfirm(false); setPhase("run"); };

  useEffect(() => {
    if (phase !== "run") return undefined;
    const id = setInterval(() => { setElapsed((e) => e + 1); setLeft((t) => t - 1); }, 1000);
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => { if (phase === "run" && timed && left <= 0) endSection(); }, [left, phase]);
  useEffect(() => { if (phase === "done") onFinish({ ans, elapsed, timed }); }, [phase]);

  if (phase === "done") return <div className="card"><p>Scoring your test...</p></div>;

  if (phase === "intro") {
    return (
      <div className="card">
        <h2>{test.name}</h2>
        <p className="muted">{test.total} questions, {test.sections.length} sections, about {test.minutes} minutes. This test is built to be harder than the real thing, so a score that feels low is normal.</p>
        <table className="tbl"><thead><tr><th>Section</th><th>Questions</th><th>Time</th></tr></thead><tbody>
          {test.sections.map((s) => <tr key={s.id}><td>{s.name}</td><td>{s.qs.length}</td><td>{s.min} min</td></tr>)}
        </tbody></table>
        <h3 style={{ marginTop: 14 }}>Rules</h3>
        <ul className="ci">
          <li>No calculator, no notes. Use scratch paper.</li>
          <li>You get feedback only at the end.</li>
          <li>When a section ends, you cannot go back to it, like on a real test.</li>
          <li>Use the flag button to mark questions to revisit before the section ends.</li>
        </ul>
        <label className="row small" style={{ margin: "10px 0" }}>
          <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} />
          Timed mode (recommended). Uncheck to practice without a timer.
        </label>
        <div className="row">
          <button className="btn" onClick={() => startSection(0)}>Begin Section 1</button>
          <button className="btn ghost" onClick={onExit}>Not now</button>
        </div>
      </div>
    );
  }

  if (phase === "between") {
    const nxt = test.sections[si + 1];
    return (
      <div className="card">
        <h2>{sec.name} complete</h2>
        <p className="muted">Take a quick stretch if you need one. When you are ready, the next section starts its timer right away.</p>
        <p><b>Next:</b> {nxt.name} ({nxt.qs.length} questions, {nxt.min} min)</p>
        <button className="btn" onClick={() => startSection(si + 1)}>Begin Section {si + 2}</button>
      </div>
    );
  }

  const answered = sec.qs.filter((x) => ans[x.id] !== undefined).length;
  return (
    <div>
      <div className="row spread" style={{ marginBottom: 8 }}>
        <div><b>{sec.name}</b> <span className="muted small">Section {si + 1} of {test.sections.length}</span></div>
        <div className="row">
          {timed ? <span className={"timer" + (left < 60 ? " low" : "")}>{fmtTime(left)}</span> : <span className="chip">Untimed</span>}
          {!leave ? <button className="btn sm ghost" onClick={() => setLeave(true)}>Exit</button>
            : <button className="btn sm" style={{ background: "var(--bad)", color: "#fff" }} onClick={onExit}>Quit and lose progress?</button>}
        </div>
      </div>
      <div className="nums">
        {sec.qs.map((x, k) => (
          <button key={x.id} className={(ans[x.id] !== undefined ? "ans " : "") + (flags[x.id] ? "flag " : "") + (k === qi ? "cur" : "")} onClick={() => setQi(k)}>{k + 1}</button>
        ))}
      </div>
      <div className="card">
        <Passage pass={q.pass} />
        <div className="muted small" style={{ marginBottom: 4 }}>Question {qi + 1} of {sec.qs.length}</div>
        <div className="qtext"><Rich html={q.q} /></div>
        <Options q={q} sel={ans[q.id] === undefined ? null : ans[q.id]} onPick={(k) => setAns((a) => ({ ...a, [q.id]: a[q.id] === k ? undefined : k }))} reveal={false} />
        <div className="row spread" style={{ marginTop: 6 }}>
          <div className="row">
            <button className="btn sm ghost" disabled={qi === 0} onClick={() => setQi(qi - 1)}>Back</button>
            <button className="btn sm ghost" disabled={qi + 1 >= sec.qs.length} onClick={() => setQi(qi + 1)}>Next</button>
            <button className="btn sm ghost" onClick={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))}>{flags[q.id] ? "Unflag" : "Flag"}</button>
          </div>
          {!confirm ? <button className="btn sm" onClick={() => setConfirm(true)}>Finish section</button>
            : <div className="row"><span className="small">{answered}/{sec.qs.length} answered. Finish?</span><button className="btn sm good" onClick={endSection}>Yes</button><button className="btn sm ghost" onClick={() => setConfirm(false)}>No</button></div>}
        </div>
      </div>
    </div>
  );
}

/* ===================== TEST REVIEW ===================== */
function TestReview({ test, rec, onBack, onDrill }) {
  const [filter, setFilter] = useState("wrong");
  if (!rec) return <div className="card"><p>No attempt saved yet.</p><button className="btn" onClick={onBack}>Back</button></div>;
  const r = rec.last;
  const items = [];
  let n = 0;
  test.sections.forEach((s) => s.qs.forEach((q) => { n++; items.push({ q, n, sec: s.name, sel: r.ans[q.id] }); }));
  const shown = items.filter((x) => (filter === "wrong" ? x.sel !== x.q.a : true));
  const tags = Object.entries(r.byTag).map(([t, [c, tot]]) => ({ t, c, tot, p: pct(c, tot) })).sort((a, b) => a.p - b.p);
  const wrongIds = items.filter((x) => x.sel !== x.q.a).map((x) => x.q.id);
  return (
    <div>
      <div className="card">
        <div className="muted small">{test.name}, {new Date(r.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{r.timed ? "" : ", untimed"}</div>
        <div className="row" style={{ alignItems: "flex-end", margin: "6px 0 8px" }}>
          <div className="big">{r.correct}/{r.total}</div>
          <div className="muted" style={{ paddingBottom: 4 }}>{pct(r.correct, r.total)}% &nbsp;|&nbsp; {Math.round(r.elapsed / 60)} min</div>
        </div>
        <div className="bar" style={{ marginBottom: 12 }}><i style={{ width: pct(r.correct, r.total) + "%" }} /></div>
        <div className="grid2">
          <div>
            <h3 className="small">By section</h3>
            {test.sections.map((s) => { const [c, t] = r.bySec[s.id]; return (
              <div key={s.id} style={{ marginBottom: 8 }}>
                <div className="row spread small"><span>{s.name}</span><b>{c}/{t}</b></div>
                <div className={"bar " + (pct(c, t) < 60 ? "bad" : "")}><i style={{ width: pct(c, t) + "%" }} /></div>
              </div>
            ); })}
          </div>
          <div>
            <h3 className="small">By topic (weakest first)</h3>
            {tags.map((x) => (
              <div key={x.t} style={{ marginBottom: 8 }}>
                <div className="row spread small"><span>{TAG_NAMES[x.t] || x.t}</span><b>{x.c}/{x.tot}</b></div>
                <div className={"bar " + (x.p < 60 ? "bad" : "")}><i style={{ width: x.p + "%" }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div className="row" style={{ marginTop: 10 }}>
          {wrongIds.length > 0 && <button className="btn" onClick={() => onDrill(wrongIds)}>Drill my {wrongIds.length} misses</button>}
          <button className="btn ghost" onClick={onBack}>Back to tests</button>
        </div>
      </div>
      <div className="row" style={{ margin: "12px 0" }}>
        <button className={"btn sm " + (filter === "wrong" ? "" : "ghost")} onClick={() => setFilter("wrong")}>Missed only ({wrongIds.length})</button>
        <button className={"btn sm " + (filter === "all" ? "" : "ghost")} onClick={() => setFilter("all")}>All questions</button>
      </div>
      {shown.map((x) => (
        <div className="card" key={x.q.id}>
          <div className="note">{x.sec}, question {x.n} {x.q.pass ? `, passage: ${x.q.pass.title}` : ""}</div>
          <div className="qtext"><Rich html={x.q.q} /></div>
          <div className="small">
            {x.sel === undefined ? <span className="pill r">No answer</span> : <><span className={"pill " + (x.sel === x.q.a ? "g" : "r")}>Your answer</span><Rich html={x.q.o[x.sel]} /></>}
          </div>
          {x.sel !== x.q.a && <div className="small" style={{ marginTop: 4 }}><span className="pill g">Correct</span><Rich html={x.q.o[x.q.a]} /></div>}
          <div className="expl">{x.q.e}</div>
        </div>
      ))}
      {shown.length === 0 && <div className="card"><p>Nothing missed. Excellent.</p></div>}
    </div>
  );
}

/* ===================== WORDS ===================== */
function WordsView({ P, upd, range }) {
  const [mode, setMode] = useState(range ? "set" : "all");
  const [pos, setPos] = useState(0);
  const [flip, setFlip] = useState(false);
  const deck = useMemo(() => {
    let idx = WORDS.map((_, i) => i);
    if (mode === "set" && range && range !== "learning") { const [a, b] = range.split("-").map(Number); idx = idx.slice(a, b); }
    if (mode === "learning" || (mode === "set" && range === "learning")) idx = idx.filter((i) => P.flash[WORDS[i][0]] === "learning");
    return idx;
  }, [mode, range, P.flash]);
  const known = WORDS.filter((w) => P.flash[w[0]] === "known").length;
  const learning = WORDS.filter((w) => P.flash[w[0]] === "learning").length;
  const cur = deck.length ? WORDS[deck[pos % deck.length]] : null;
  const mark = (v) => { upd((n) => { n.flash[cur[0]] = v; }); setFlip(false); setPos((p) => p + 1); };
  const chips = [["all", "All words"], ["learning", "Still learning"]];
  if (range) chips.unshift(["set", range === "learning" ? "Today's review" : "Today's set"]);
  return (
    <div>
      <div className="row spread" style={{ marginBottom: 10 }}>
        <div className="row">{chips.map(([m, l]) => <button key={m} className={"btn sm " + (mode === m ? "" : "ghost")} onClick={() => { setMode(m); setPos(0); setFlip(false); }}>{l}</button>)}</div>
        <div className="small muted">Known {known} | Learning {learning} | Total {WORDS.length}</div>
      </div>
      {!cur ? <div className="card"><p>No words in this set yet. Mark some cards "Still learning" first, or switch to All words.</p></div> : (
        <div>
          <div className="small muted" style={{ marginBottom: 6 }}>Card {(pos % deck.length) + 1} of {deck.length}. Tap the card to flip.</div>
          <button className="flash" onClick={() => setFlip(!flip)}>
            {!flip ? <div className="w">{cur[0]}</div> : <div><div className="d">{cur[1]}</div><div className="s">{cur[2]}</div></div>}
          </button>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn ghost" onClick={() => mark("learning")}>Still learning</button>
            <button className="btn good" onClick={() => mark("known")}>Got it</button>
            <button className="btn sm ghost" onClick={() => { setPos(pos + 1); setFlip(false); }}>Skip</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== HOME / PLAN ===================== */
function dayProgress(day, P) {
  const done = day.tasks.filter((t, k) => isTaskDone(t, `${day.i}-${k}`, P)).length;
  return { done, total: day.tasks.length, frac: done / day.tasks.length };
}

function HomeView({ P, upd, go, selDay, setSelDay }) {
  const today = todayIdx();
  const day = PLAN[selDay];
  const totals = PLAN.reduce((a, d) => { const p = dayProgress(d, P); return [a[0] + p.done, a[1] + p.total]; }, [0, 0]);
  const dtt = daysToTest();

  const open = (t) => {
    if (t.k === "lesson") go({ name: "lesson", id: t.ref });
    else if (t.k === "quiz") go({ name: "quiz", kind: "module", mod: t.ref });
    else if (t.k === "test") go({ name: "tests" });
    else if (t.k === "review") go({ name: "testreview", testId: t.ref });
    else if (t.k === "flash") go({ name: "words", range: t.ref });
    else if (t.k === "weak") go({ name: "quiz", kind: "weak" });
    else if (t.k === "challenge") go({ name: "quiz", kind: "challenge" });
    else if (t.k === "cheat") go({ name: "cheat" });
    else if (t.k === "weakest") {
      const scored = MODULES.filter((m) => P.quiz[m.id]).sort((a, b) => pct(...P.quiz[a.id].best) - pct(...P.quiz[b.id].best));
      go({ name: "quiz", kind: "module", mod: (scored[0] || MODULES[0]).id });
    }
  };
  const actionLabel = (t) => ({ lesson: "Learn", quiz: "Quiz", test: "Open", review: "Review", flash: "Cards", weak: "Drill", challenge: "Start", cheat: "Read", weakest: "Retake", rest: "" }[t.k]);

  return (
    <div>
      <div className="card">
        <div className="row spread">
          <div>
            <h2 style={{ fontSize: 20 }}>Your 14-day plan</h2>
            <div className="muted small">1 hour on weekdays, 2 hours on weekends. Taller bars are longer study days.</div>
          </div>
          <div className="chip">{dtt > 0 ? <><b>{dtt}</b> days to the test</> : dtt === 0 ? "Test day. You are ready." : "Plan complete"}</div>
        </div>
        <div className="strip" style={{ marginTop: 10 }}>
          {PLAN.map((d) => {
            const p = dayProgress(d, P);
            const h = d.mins >= 120 ? 96 : 58;
            return (
              <button key={d.i} className={"day" + (d.i === selDay ? " sel" : "") + (d.i === today ? " today" : "")} onClick={() => setSelDay(d.i)} aria-label={`Day ${d.i + 1}, ${fmtDate(d.date)}`}>
                <div className="col" style={{ height: h }}><em>{d.mins / 60}h</em><i style={{ height: p.frac * 100 + "%" }} /></div>
                <div className="lab">{WEEKDAYS[d.date.getDay()]}<b>{d.date.getDate()}</b></div>
              </button>
            );
          })}
        </div>
        <div className="row spread small" style={{ marginTop: 8 }}>
          <span className="muted">Plan progress</span><b>{totals[0]} of {totals[1]} tasks</b>
        </div>
        <div className="bar" style={{ marginTop: 4 }}><i style={{ width: pct(totals[0], totals[1]) + "%" }} /></div>
      </div>

      <div className="card">
        <div className="row spread">
          <div>
            <div className="muted small">Day {day.i + 1} of 14 | {fmtDate(day.date)}{day.i === today ? " | Today" : ""}</div>
            <h2 style={{ fontSize: 20 }}>{day.title}</h2>
          </div>
          <span className="chip">{day.mins} min</span>
        </div>
        <div style={{ marginTop: 6 }}>
          {day.tasks.map((t, k) => {
            const key = `${day.i}-${k}`;
            const done = isTaskDone(t, key, P);
            return (
              <div key={key} className={"task" + (done ? " done" : "")}>
                <button className="ck" aria-label="Mark done" onClick={() => upd((n) => { n.tasks[key] = !n.tasks[key]; })}>{done ? "✓" : ""}</button>
                <div className="tl">{taskLabel(t)}</div>
                <div className="mn">{t.m} min</div>
                {t.k !== "rest" && <button className="btn sm" onClick={() => open(t)}>{actionLabel(t)}</button>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="note">Dates assume the test is on Thursday, Oct. 29. If the date changes, just follow the order of the days. Progress saves automatically on this device.</div>
    </div>
  );
}

/* ===================== LEARN ===================== */
function LearnView({ P, go }) {
  const doneAll = Object.keys(P.lessons).length;
  return (
    <div>
      <div className="row spread" style={{ marginBottom: 10 }}>
        <div><h2 style={{ fontSize: 20, margin: 0 }}>Topics</h2><div className="muted small">Learn each concept, then take the quiz.</div></div>
        <span className="chip"><b>{doneAll}</b> of {TOTAL_LESSONS} lessons learned</span>
      </div>
      <div className="grid2">
        {MODULES.map((m) => {
          const ld = m.lessons.filter((l) => P.lessons[l.id]).length;
          const qs = P.quiz[m.id];
          return (
            <button key={m.id} className="mod" style={{ "--c": m.color }} onClick={() => go({ name: "module", id: m.id })}>
              <b>{m.name}</b>
              <div className="muted small">{m.blurb}</div>
              <div className="row small" style={{ marginTop: 6 }}>
                <span className={"pill " + (ld === m.lessons.length ? "g" : "")}>{ld}/{m.lessons.length} lessons</span>
                <span className={"pill " + (qs ? (pct(...qs.best) >= 70 ? "g" : "r") : "")}>{qs ? `Quiz best ${pct(...qs.best)}%` : "Quiz not taken"}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ModuleView({ mod, P, go }) {
  const qs = P.quiz[mod.id];
  return (
    <div>
      <button className="btn sm ghost" onClick={() => go({ name: "learn" })}>All topics</button>
      <h2 style={{ fontSize: 24, margin: "10px 0 2px", color: "var(--brand)" }}>{mod.name}</h2>
      <div className="muted" style={{ marginBottom: 12 }}>{mod.blurb}</div>
      {mod.lessons.map((l) => (
        <button key={l.id} className="mod" style={{ "--c": mod.color, marginBottom: 10 }} onClick={() => go({ name: "lesson", id: l.id })}>
          <div className="row spread"><b>{l.title}</b><span className={"pill " + (P.lessons[l.id] ? "g" : "")}>{P.lessons[l.id] ? "Learned" : `${l.min} min`}</span></div>
        </button>
      ))}
      <div className="card" style={{ marginTop: 14 }}>
        <h3>{mod.name} quiz</h3>
        <p className="muted small" style={{ margin: "0 0 10px" }}>{mod.quiz.length} questions, built hard. You see the explanation after each one.{qs ? ` Best so far: ${qs.best[0]}/${qs.best[1]}.` : ""}</p>
        <button className="btn" onClick={() => go({ name: "quiz", kind: "module", mod: mod.id })}>Start quiz</button>
      </div>
    </div>
  );
}

function LessonView({ lesson, P, upd, go }) {
  const mod = lesson.mod;
  const idx = mod.lessons.findIndex((l) => l.id === lesson.id);
  const nxt = mod.lessons[idx + 1];
  const done = !!P.lessons[lesson.id];
  return (
    <div>
      <button className="btn sm ghost" onClick={() => go({ name: "module", id: mod.id })}>{mod.name}</button>
      <div className="card" style={{ marginTop: 10, borderTop: `6px solid ${mod.color}` }}>
        <div className="muted small">Lesson {idx + 1} of {mod.lessons.length} | about {lesson.min} min</div>
        <h2 style={{ fontSize: 24, margin: "2px 0 14px" }}>{lesson.title}</h2>
        <div className="lesson">{lesson.blocks.map((b, i) => <Block key={i} b={b} />)}</div>
        <div className="row" style={{ marginTop: 16 }}>
          {!done ? <button className="btn good" onClick={() => upd((n) => { n.lessons[lesson.id] = true; })}>Mark as learned</button> : <span className="pill g">Learned</span>}
          {nxt ? <button className="btn" onClick={() => { upd((n) => { n.lessons[lesson.id] = true; }); go({ name: "lesson", id: nxt.id }); }}>Next lesson</button>
            : <button className="btn" onClick={() => { upd((n) => { n.lessons[lesson.id] = true; }); go({ name: "quiz", kind: "module", mod: mod.id }); }}>Take the quiz</button>}
        </div>
      </div>
    </div>
  );
}

/* ===================== TESTS LIST ===================== */
function TestsView({ P, upd, go }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, margin: "0 0 4px" }}>Full-length practice tests</h2>
      <div className="muted small" style={{ marginBottom: 12 }}>Each has 64 questions across 7 sections and takes about 92 minutes. Plan: Test 1 on Sunday Oct. 18, Test 2 on Sunday Oct. 25.</div>
      {TESTS.map((t) => {
        const rec = P.tests[t.id];
        return (
          <div className="card" key={t.id}>
            <h3>{t.name}</h3>
            <div className="muted small">{t.blurb}</div>
            <div className="small" style={{ margin: "8px 0" }}>{t.sections.map((s) => `${s.name} (${s.qs.length})`).join(" | ")}</div>
            {rec && <div className="row small" style={{ marginBottom: 8 }}><span className="pill g">Last: {rec.last.correct}/{rec.last.total} ({pct(rec.last.correct, rec.last.total)}%)</span><span className="pill">Attempts: {rec.n}</span></div>}
            <div className="row">
              <button className="btn" onClick={() => go({ name: "test", testId: t.id })}>{rec ? "Retake" : "Start test"}</button>
              {rec && <button className="btn ghost" onClick={() => go({ name: "testreview", testId: t.id })}>Review last attempt</button>}
            </div>
          </div>
        );
      })}
      <div className="card">
        <label className="row small">
          <input type="checkbox" checked={P.untimed} onChange={(e) => upd((n) => { n.untimed = e.target.checked; })} />
          Start tests untimed by default (use only for the first try if the timer feels too stressful).
        </label>
      </div>
    </div>
  );
}

/* ===================== REVIEW TAB ===================== */
function ReviewView({ P, go, onRestore }) {
  const [showCode, setShowCode] = useState(false);
  const [paste, setPaste] = useState("");
  const [msg, setMsg] = useState("");
  const missed = Object.keys(P.missed).filter((id) => ALLQ[id]);
  const byTag = {};
  missed.forEach((id) => { const q = ALLQ[id]; const t = q.tag || q.mod || "?"; byTag[t] = (byTag[t] || 0) + 1; });
  const tags = Object.entries(byTag).sort((a, b) => b[1] - a[1]);
  return (
    <div>
      <div className="grid2">
        <div className="card">
          <h3>Weak-spot drill</h3>
          <p className="muted small" style={{ margin: "0 0 10px" }}>Up to 20 questions you have missed in quizzes and tests. Get one right and it leaves the list.</p>
          <div className="row"><span className="chip"><b>{missed.length}</b> in your list</span><button className="btn" disabled={!missed.length} onClick={() => go({ name: "quiz", kind: "weak" })}>Start drill</button></div>
          {tags.length > 0 && <div className="small" style={{ marginTop: 10 }}>Most missed: {tags.slice(0, 3).map(([t, c]) => `${TAG_NAMES[t] || t} (${c})`).join(", ")}</div>}
        </div>
        <div className="card">
          <h3>Challenge round</h3>
          <p className="muted small" style={{ margin: "0 0 10px" }}>20 random questions from every topic, mixed together like the real test.</p>
          <button className="btn" onClick={() => go({ name: "quiz", kind: "challenge" })}>Start challenge</button>
        </div>
      </div>
      <h2 className="sec">Quiz scores</h2>
      <div className="card">
        <table className="tbl"><thead><tr><th>Topic</th><th>Best</th><th>Last</th><th>Tries</th></tr></thead><tbody>
          {MODULES.map((m) => { const r = P.quiz[m.id]; return (
            <tr key={m.id}><td>{m.name}</td><td>{r ? `${pct(...r.best)}%` : "-"}</td><td>{r ? `${pct(...r.last)}%` : "-"}</td><td>{r ? r.n : 0}</td></tr>
          ); })}
        </tbody></table>
      </div>
      <h2 className="sec">Test scores</h2>
      <div className="card">
        <table className="tbl"><thead><tr><th>Test</th><th>Last</th><th>Best</th><th></th></tr></thead><tbody>
          {TESTS.map((t) => { const r = P.tests[t.id]; return (
            <tr key={t.id}><td>{t.name.split(":")[0]}</td><td>{r ? `${pct(r.last.correct, r.last.total)}%` : "-"}</td><td>{r ? `${pct(r.best, r.last.total)}%` : "-"}</td>
              <td>{r && <button className="btn sm ghost" onClick={() => go({ name: "testreview", testId: t.id })}>Review</button>}</td></tr>
          ); })}
        </tbody></table>
      </div>
      <h2 className="sec">Back up or move your progress</h2>
      <div className="card">
        <p className="muted small" style={{ margin: "0 0 10px" }}>Progress is saved in this browser only. To move to another device or browser, copy the backup code here and paste it there.</p>
        <div className="row">
          <button className="btn sm ghost" onClick={() => setShowCode(!showCode)}>{showCode ? "Hide backup code" : "Show backup code"}</button>
        </div>
        {showCode && <textarea readOnly rows={4} style={{ width: "100%", marginTop: 8, fontSize: 12 }} value={JSON.stringify(P)} onFocus={(e) => e.target.select()} />}
        <div style={{ marginTop: 12 }}>
          <textarea rows={3} placeholder="Paste a backup code here to restore" style={{ width: "100%", fontSize: 12 }} value={paste} onChange={(e) => { setPaste(e.target.value); setMsg(""); }} />
          <div className="row" style={{ marginTop: 6 }}>
            <button className="btn sm" disabled={!paste.trim()} onClick={() => { try { const o = JSON.parse(paste); if (!o || typeof o !== "object" || !o.lessons) throw new Error("bad"); onRestore(o); setPaste(""); setMsg("Progress restored."); } catch (e) { setMsg("That code did not look right. Copy the whole thing and try again."); } }}>Restore</button>
            <span className="small muted">{msg}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== CHEAT SHEET ===================== */
function CheatView() {
  return (
    <div>
      <h2 style={{ fontSize: 20, margin: "0 0 4px" }}>Cheat sheet</h2>
      <div className="muted small" style={{ marginBottom: 12 }}>Everything worth memorizing, on one page. Read it the night before and the morning of the test.</div>
      {CHEAT.map((s) => (
        <div className="card" key={s.h}>
          <h3>{s.h}</h3>
          <ul className="ci">{s.items.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}

/* ===================== APP ===================== */
export default function App() {
  const [P, setP] = useState(EMPTY);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState({ name: "home" });
  const [selDay, setSelDay] = useState(todayIdx());
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    let alive = true;
    loadProgress().then((p) => { if (!alive) return; if (p) setP({ ...EMPTY, ...p }); setLoaded(true); });
    return () => { alive = false; };
  }, []);
  useEffect(() => { if (loaded) saveProgress(P); }, [P, loaded]);

  const upd = useCallback((fn) => setP((p) => { const n = clone(p); fn(n); return n; }), []);
  const go = (v) => { setRunKey((k) => k + 1); setView(v); if (typeof window !== "undefined" && window.scrollTo) { try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } } };

  const tab = { home: "home", learn: "learn", module: "learn", lesson: "learn", tests: "tests", test: "tests", testreview: "tests", words: "words", quiz: "review", review: "review", cheat: "cheat" }[view.name] || "home";
  const tabs = [["home", "Plan"], ["learn", "Learn"], ["tests", "Tests"], ["words", "Words"], ["review", "Review"], ["cheat", "Cheat sheet"]];
  const inTest = view.name === "test";

  const recordQuiz = (log, kind, mod) => {
    upd((n) => {
      log.forEach((l) => { if (l.ok) delete n.missed[l.id]; else n.missed[l.id] = true; });
      if (kind === "module" && mod) {
        const c = log.filter((l) => l.ok).length, t = log.length;
        const old = n.quiz[mod];
        n.quiz[mod] = { best: old && pct(...old.best) >= pct(c, t) ? old.best : [c, t], last: [c, t], n: (old ? old.n : 0) + 1 };
      }
    });
  };
  const finishTest = (test, res) => {
    const bySec = {}, byTag = {};
    let correct = 0;
    test.sections.forEach((s) => {
      let c = 0;
      s.qs.forEach((q) => {
        const ok = res.ans[q.id] === q.a;
        if (ok) c++;
        byTag[q.tag] = byTag[q.tag] || [0, 0];
        byTag[q.tag][1]++;
        if (ok) byTag[q.tag][0]++;
      });
      bySec[s.id] = [c, s.qs.length];
      correct += c;
    });
    upd((n) => {
      const old = n.tests[test.id];
      n.tests[test.id] = { last: { date: new Date().toISOString(), correct, total: test.total, bySec, byTag, ans: res.ans, elapsed: res.elapsed, timed: res.timed }, n: (old ? old.n : 0) + 1, best: Math.max(old ? old.best : 0, correct) };
      test.sections.forEach((s) => s.qs.forEach((q) => { if (res.ans[q.id] === q.a) delete n.missed[q.id]; else n.missed[q.id] = true; }));
    });
    setView({ name: "testreview", testId: test.id });
  };

  let body = null;
  if (!loaded) body = <div className="card"><p>Loading your progress...</p></div>;
  else if (view.name === "home") body = <HomeView P={P} upd={upd} go={go} selDay={selDay} setSelDay={setSelDay} />;
  else if (view.name === "learn") body = <LearnView P={P} go={go} />;
  else if (view.name === "module") body = <ModuleView mod={MOD_BY_ID[view.id]} P={P} go={go} />;
  else if (view.name === "lesson") body = <LessonView lesson={LESSON_BY_ID[view.id]} P={P} upd={upd} go={go} />;
  else if (view.name === "tests") body = <TestsView P={P} upd={upd} go={go} />;
  else if (view.name === "test") {
    const t = TESTS.find((x) => x.id === view.testId);
    body = <TestRunner key={runKey} test={t} untimed={P.untimed} onFinish={(r) => finishTest(t, r)} onExit={() => go({ name: "tests" })} />;
  } else if (view.name === "testreview") {
    const t = TESTS.find((x) => x.id === view.testId);
    body = <TestReview test={t} rec={P.tests[t.id]} onBack={() => go({ name: "tests" })} onDrill={(ids) => go({ name: "quiz", kind: "ids", ids, title: "Drill: my misses" })} />;
  } else if (view.name === "words") body = <WordsView key={runKey} P={P} upd={upd} range={view.range} />;
  else if (view.name === "review") body = <ReviewView P={P} go={go} onRestore={(o) => setP({ ...EMPTY, ...o })} />;
  else if (view.name === "cheat") body = <CheatView />;
  else if (view.name === "quiz") {
    let qs = [], title = "Quiz";
    if (view.kind === "module") { const m = MOD_BY_ID[view.mod]; qs = m.quiz; title = `${m.name} quiz`; }
    else if (view.kind === "weak") { qs = shuffle(Object.keys(P.missed).filter((id) => ALLQ[id])).slice(0, 20).map((id) => ALLQ[id]); title = "Weak-spot drill"; }
    else if (view.kind === "challenge") { qs = shuffle(MODULES.flatMap((m) => m.quiz)).slice(0, 20); title = "Challenge round"; }
    else if (view.kind === "ids") { qs = view.ids.map((id) => ALLQ[id]).filter(Boolean); title = view.title || "Drill"; }
    body = <QuizRunnerHolder key={runKey} qs={qs} title={title} view={view} recordQuiz={recordQuiz} go={go} />;
  }

  return (
    <div className="ap">
      <style>{CSS}</style>
      <div className="wrap">
        <div className="top">
          <div>
            <h1 className="brand">Arjun's CTP 5 Prep</h1>
            <p className="sub">14 days. Learn it, quiz it, test it.</p>
          </div>
          <span className="chip">{Object.keys(P.lessons).length}/{TOTAL_LESSONS} lessons <b>|</b> {Object.keys(P.tests).length}/2 tests</span>
        </div>
        {!inTest && (
          <div className="nav" role="tablist">
            {tabs.map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => go({ name: k })}>{l}</button>)}
          </div>
        )}
        {body}
      </div>
    </div>
  );
}

// Holds the quiz questions steady for the whole run (the missed list changes as answers are recorded)
function QuizRunnerHolder({ qs, title, view, recordQuiz, go }) {
  const fixed = useRef(qs).current;
  const exit = () => go(view.kind === "module" ? { name: "module", id: view.mod } : { name: "review" });
  return (
    <QuizRunner
      title={title}
      qs={fixed}
      onDone={(log) => recordQuiz(log, view.kind, view.mod)}
      onExit={exit}
      onRetry={(ids) => go({ name: "quiz", kind: "ids", ids, title: "Retry: missed questions" })}
    />
  );
}
