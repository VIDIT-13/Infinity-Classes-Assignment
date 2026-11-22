const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Question = require('../models/Question');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

// Authentic Class 10 CBSE Board Science Questions (Physics, Chemistry, Biology)
const sampleQuestions = [
  {
    questionText: 'When dilute hydrochloric acid (HCl) is added to granulated iron filings in a test tube, which gas is produced along with iron(II) chloride?',
    codeSnippet: 'Fe (s) + 2HCl (aq) ──> FeCl2 (aq) + H2 (g) ↑',
    options: [
      'Hydrogen gas and iron chloride are produced',
      'Chlorine gas and iron hydroxide are produced',
      'No chemical reaction takes place',
      'Iron salt and water only are produced',
    ],
    correctOptionIndex: 0,
    explanation: 'Active metals like iron react with dilute mineral acids to liberate hydrogen gas and form corresponding metal salts. Fe + 2HCl → FeCl2 + H2↑.',
    category: 'Chemistry — Chemical Reactions & Equations',
    difficulty: 'easy',
  },
  {
    questionText: 'Which of the following chemical compounds does NOT contain water of crystallization in its chemical formula?',
    codeSnippet: 'Blue Vitriol: CuSO4·5H2O | Washing Soda: Na2CO3·10H2O | Gypsum: CaSO4·2H2O',
    options: [
      'Blue vitriol (Copper sulphate)',
      'Baking soda (Sodium hydrogen carbonate)',
      'Washing soda (Sodium carbonate decahydrate)',
      'Gypsum (Calcium sulphate dihydrate)',
    ],
    correctOptionIndex: 1,
    explanation: 'Baking soda formula is NaHCO3 and does not contain water of crystallization. Blue vitriol is CuSO4·5H2O, Washing soda is Na2CO3·10H2O, and Gypsum is CaSO4·2H2O.',
    category: 'Chemistry — Acids, Bases & Salts',
    difficulty: 'medium',
  },
  {
    questionText: 'Which metal exists in liquid state at standard room temperature, and which non-metal exhibits metallic lustre?',
    codeSnippet: 'Atomic Symbols: Hg (Hydrargyrum), I (Iodine), Br (Bromine), Ga (Gallium)',
    options: [
      'Mercury (metal) and Iodine (non-metal)',
      'Bromine (metal) and Carbon (non-metal)',
      'Gallium (metal) and Sulphur (non-metal)',
      'Sodium (metal) and Phosphorus (non-metal)',
    ],
    correctOptionIndex: 0,
    explanation: 'Mercury (Hg) is the only metal that is liquid at room temperature. Iodine (I) is a non-metal that displays a distinct metallic lustre.',
    category: 'Chemistry — Metals & Non-Metals',
    difficulty: 'easy',
  },
  {
    questionText: 'What is the general formula for the homologous series of Alkenes containing one double covalent bond between carbon atoms?',
    codeSnippet: 'Examples: Ethene (C2H4), Propene (C3H6), Butene (C4H8)',
    options: [
      'CnH2n+2',
      'CnH2n',
      'CnH2n-2',
      'CnH2n+1',
    ],
    correctOptionIndex: 1,
    explanation: 'Alkanes have general formula CnH2n+2, Alkenes have CnH2n, and Alkynes have CnH2n-2 (where n is the number of carbon atoms).',
    category: 'Chemistry — Carbon & Its Compounds',
    difficulty: 'easy',
  },
  {
    questionText: 'Where should an object be placed in front of a concave mirror to obtain an inverted, real image of the exact same size as the object?',
    codeSnippet: 'Magnification m = -v / u = -1 (Real & Inverted)',
    options: [
      'At the principal focus (F)',
      'At the centre of curvature (C)',
      'Between the principal focus and pole',
      'Beyond the centre of curvature',
    ],
    correctOptionIndex: 1,
    explanation: 'When an object is placed at the centre of curvature (C) of a concave spherical mirror, the image is formed at C itself. The image is real, inverted, and equal in size (m = -1).',
    category: 'Physics — Light: Reflection & Refraction',
    difficulty: 'medium',
  },
  {
    questionText: 'A ray of light enters from air into a glass slab with refractive index n = 1.50. What is the speed of light inside the glass? (Speed of light in vacuum c = 3 × 10⁸ m/s)',
    codeSnippet: 'Refractive Index formula: n = c / v  =>  v = c / n',
    options: [
      '2.0 × 10⁸ m/s',
      '1.5 × 10⁸ m/s',
      '4.5 × 10⁸ m/s',
      '3.0 × 10⁸ m/s',
    ],
    correctOptionIndex: 0,
    explanation: 'Speed of light in glass v = c / n = (3.0 × 10⁸ m/s) / 1.50 = 2.0 × 10⁸ m/s.',
    category: 'Physics — Light: Reflection & Refraction',
    difficulty: 'medium',
  },
  {
    questionText: 'If three electrical resistors of resistance 2 Ω, 3 Ω, and 6 Ω are connected in a parallel combination, what is their equivalent resistance?',
    codeSnippet: '1 / Req = 1/R1 + 1/R2 + 1/R3 = 1/2 + 1/3 + 1/6',
    options: [
      '11 Ω',
      '1 Ω',
      '0.5 Ω',
      '5 Ω',
    ],
    correctOptionIndex: 1,
    explanation: 'In parallel combination: 1/Req = 1/2 + 1/3 + 1/6 = (3 + 2 + 1) / 6 = 6/6 = 1. Therefore, Req = 1 Ω.',
    category: 'Physics — Electricity',
    difficulty: 'medium',
  },
  {
    questionText: 'According to Fleming\'s Left-Hand Rule used for electric motors, what do the thumb, forefinger, and middle finger indicate respectively?',
    codeSnippet: 'Left Hand: Stretch thumb, forefinger, and middle finger mutually perpendicular.',
    options: [
      'Direction of Force/Motion, Magnetic Field, and Electric Current',
      'Direction of Magnetic Field, Current, and Force',
      'Direction of Electric Current, Force, and Magnetic Field',
      'Direction of Induced EMF, Magnetic Field, and Motion',
    ],
    correctOptionIndex: 0,
    explanation: 'In Fleming\'s Left-Hand Rule: Thumb represents the direction of Force (Motion) on the conductor, Forefinger points along Magnetic Field, and Middle finger points in the direction of Current.',
    category: 'Physics — Magnetic Effects of Electric Current',
    difficulty: 'easy',
  },
  {
    questionText: 'During cellular respiration in humans, the breakdown of pyruvate using oxygen takes place in which cellular organelle?',
    codeSnippet: 'Pyruvate (3-Carbon) + O2 ──> 6 CO2 + 6 H2O + 38 ATP',
    options: [
      'Cytoplasm',
      'Mitochondria',
      'Chloroplast',
      'Endoplasmic Reticulum',
    ],
    correctOptionIndex: 1,
    explanation: 'Glycolysis (glucose to pyruvate) takes place in the cytoplasm. The aerobic breakdown of pyruvate into carbon dioxide, water, and ATP requires oxygen and occurs inside the mitochondria.',
    category: 'Biology — Life Processes',
    difficulty: 'easy',
  },
  {
    questionText: 'In the human excretory system, what is the basic structural and microscopic filtration unit of the kidney called?',
    codeSnippet: 'Bowman\'s Capsule + Glomerulus + Renal Tubule',
    options: [
      'Neuron',
      'Nephron',
      'Alveolus',
      'Ureter',
    ],
    correctOptionIndex: 1,
    explanation: 'Nephrons are the structural and functional filtration units of the mammalian kidney. Millions of nephrons filter nitrogenous waste like urea from the bloodstream to produce urine.',
    category: 'Biology — Life Processes',
    difficulty: 'easy',
  },
  {
    questionText: 'Which plant hormone synthesized at shoot tips is primarily responsible for cell elongation and phototropic curvature towards light?',
    codeSnippet: 'Unequal distribution causes differential cell elongation on the shaded side.',
    options: [
      'Auxin',
      'Gibberellin',
      'Cytokinin',
      'Abscisic Acid (ABA)',
    ],
    correctOptionIndex: 0,
    explanation: 'Auxins promote cell elongation. When unidirectional sunlight falls on a plant shoot, auxin diffuses to the shaded side, causing faster cell elongation on that side and bending the shoot toward light.',
    category: 'Biology — Control & Coordination',
    difficulty: 'medium',
  },
  {
    questionText: 'In Mendel\'s classic monohybrid inheritance experiment between pure tall (TT) and pure dwarf (tt) pea plants, what is the phenotypic ratio in the F2 generation?',
    codeSnippet: 'F1: Tt (All Tall)  ──Selfing──>  F2: TT, Tt, Tt, tt',
    options: [
      '3 : 1 (Tall : Dwarf)',
      '1 : 2 : 1 (Tall : Hybrid : Dwarf)',
      '9 : 3 : 3 : 1',
      '1 : 1',
    ],
    correctOptionIndex: 0,
    explanation: 'The phenotypic ratio in Mendel\'s monohybrid F2 generation is 3 Tall : 1 Dwarf (75% tall, 25% dwarf). The genotypic ratio is 1 TT : 2 Tt : 1 tt (1:2:1).',
    category: 'Biology — Heredity & Evolution',
    difficulty: 'easy',
  },
];

async function seedDatabase() {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      'mongodb+srv://viditallen4:YO11Y7a0pVfpXuoq@cluster0.djqlgs9.mongodb.net/mini-online-test?retryWrites=true&w=majority';

    if (!process.env.MONGODB_URI && !mongoUri) {
      console.log('⚠️  No MONGODB_URI found. Seeding aborted.');
      return;
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 20000 });
    console.log('Connected to MongoDB for seeding Class 10 CBSE Science...');

    // Replace old questions with Class 10 Science questions
    await Question.deleteMany({});
    await Question.insertMany(sampleQuestions);
    console.log(`✅ Seeded ${sampleQuestions.length} Class 10 CBSE Science questions into database.`);

    // Seed Demo Student
    const existingStudent = await User.findOne({ email: 'student@infinity.com' });
    if (!existingStudent) {
      await User.create({
        name: 'Demo Student',
        email: 'student@infinity.com',
        password: 'student123',
        role: 'student',
      });
      console.log('✅ Created demo student: student@infinity.com / student123');
    }

    // Seed Demo Admin
    const existingAdmin = await User.findOne({ email: 'admin@infinity.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'Faculty Instructor',
        email: 'admin@infinity.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Created demo admin: admin@infinity.com / admin123');
    }

    console.log('🎉 Class 10 CBSE Science Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleQuestions, seedDatabase };
