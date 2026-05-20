"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const center_model_1 = require("../models/center.model");
const program_model_1 = require("../models/program.model");
const auth_1 = require("../utils/auth");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/adele-foundation";
// ── Seed data ─────────────────────────────────────────────────────────────────
const programs = [
    // Construction & Civil Works
    {
        title: "Electrical Installation",
        category: "Construction & Civil Works",
        description: "Comprehensive training in domestic, commercial and industrial electrical wiring, installation, and safety standards. Graduates are equipped to work on building projects or start electrical contracting businesses.",
        objectives: [
            "Install and maintain electrical systems to NEC standards",
            "Wire domestic and commercial buildings safely",
            "Diagnose and fix electrical faults",
            "Understand power distribution systems",
        ],
        outcomes: [
            "75% employed in construction sector within 3 months",
            "25% start electrical contracting businesses",
            "Industry-recognised competency certificate",
        ],
    },
    {
        title: "Plumbing & Pipe-fitting",
        category: "Construction & Civil Works",
        description: "Hands-on training in water supply, drainage systems, sanitation installations, and gas pipe-fitting for residential and commercial buildings.",
        objectives: [
            "Install and maintain water supply systems",
            "Lay drainage and sanitation pipes to code",
            "Carry out gas pipe-fitting safely",
            "Read plumbing blueprints and schematics",
        ],
        outcomes: [
            "80% employed within 3 months",
            "High demand in housing construction sector",
            "Eligible for COREN support registration",
        ],
    },
    {
        title: "Brick laying, Blocklaying & Concreting",
        category: "Construction & Civil Works",
        description: "Masonry skills training covering block laying, brick work, concrete mixing and pouring, foundation construction and finishing.",
        objectives: [
            "Lay blocks and bricks to professional standard",
            "Mix and pour concrete correctly",
            "Read and follow construction drawings",
            "Estimate materials for small projects",
        ],
        outcomes: [
            "Direct employment in housing construction",
            "Self-employment on small building contracts",
            "Foundation for civil engineering work",
        ],
    },
    {
        title: "Floor Cladding, Tiling & Interlocking",
        category: "Construction & Civil Works",
        description: "Training in ceramic, porcelain and granite tile installation, floor cladding, interlocking paving and finishing techniques for residential and commercial spaces.",
        objectives: [
            "Install ceramic, porcelain and granite tiles",
            "Lay interlocking paving and driveways",
            "Apply screeds and adhesives correctly",
            "Achieve professional finishes",
        ],
        outcomes: [
            "Strong demand from real estate developers",
            "Easily self-employed after graduation",
            "Average of 3 contracts per month for graduates",
        ],
    },
    {
        title: "Painting, Decoration & Finishes",
        category: "Construction & Civil Works",
        description: "Professional painting and decorating training covering surface preparation, colour theory, interior design principles, and finishing techniques for residential and commercial spaces.",
        objectives: [
            "Prepare surfaces for painting and coating",
            "Apply paints, textures and decorative finishes",
            "Understand basic interior design principles",
            "Estimate materials and cost jobs",
        ],
        outcomes: [
            "75% self-employed within 2 months",
            "Strong repeat clientele reported by graduates",
            "Interior decoration add-on service valued highly",
        ],
    },
    // Fabrication & Metalwork
    {
        title: "Welding & Fabrication",
        category: "Fabrication & Metalwork",
        description: "Technical training in arc welding, MIG/TIG welding, metal cutting, fabrication and structural steel work. Graduates work in construction, manufacturing and start their own fabrication workshops.",
        objectives: [
            "Master arc, MIG and TIG welding techniques",
            "Fabricate gates, grilles and structural steel",
            "Read engineering drawings and cut to specification",
            "Understand metallurgy and weld quality",
        ],
        outcomes: [
            "High demand in construction and manufacturing",
            "Gate and grille fabrication is highly profitable",
            "60% self-employed within 4 months",
        ],
    },
    {
        title: "Auto-body Works (Panel Beating)",
        category: "Fabrication & Metalwork",
        description: "Training in vehicle body repair, panel beating, dent removal, rust treatment and automotive finishing. Graduates work in vehicle workshops or establish their own auto-body shops.",
        objectives: [
            "Diagnose and repair vehicle body damage",
            "Use panel beating tools and techniques",
            "Apply body filler and surface preparation",
            "Achieve professional vehicle paint finishes",
        ],
        outcomes: [
            "Strong market in vehicle-heavy Nigerian cities",
            "50% establish own workshops",
            "Average monthly income above minimum wage within 6 months",
        ],
    },
    {
        title: "Blacksmithing",
        category: "Fabrication & Metalwork",
        description: "Traditional and modern blacksmithing skills including forging, metal shaping, ornamental ironwork and tool making. Covers both traditional craft and modern applications.",
        objectives: [
            "Forge and shape metal using heat",
            "Create ornamental ironwork and tools",
            "Understand metal properties and heat treatment",
            "Combine traditional and modern techniques",
        ],
        outcomes: [
            "Growing niche market for ornamental work",
            "Unique craft highly valued in architecture",
            "Low startup cost for self-employment",
        ],
    },
    // Woodwork & Furniture
    {
        title: "Woodwork, Carpentry & Joinery",
        category: "Woodwork & Furniture",
        description: "Comprehensive woodwork training covering hand and power tools, joinery, construction carpentry, roofing and site work. Graduates work in construction or establish workshops.",
        objectives: [
            "Master hand and power tools safely",
            "Execute joinery and timber framing",
            "Carry out construction and roofing carpentry",
            "Read and follow architectural drawings",
        ],
        outcomes: [
            "75% employed in construction sector",
            "Partnered with 8+ construction firms",
            "25% open own workshops within 6 months",
        ],
    },
    {
        title: "Furniture Making & Upholstery",
        category: "Woodwork & Furniture",
        description: "Design and production of custom furniture, cabinet making, wood finishing and upholstery. Graduates supply the high-demand residential and commercial furniture market.",
        objectives: [
            "Design and build bespoke furniture",
            "Execute cabinet making and wood finishing",
            "Apply upholstery techniques to chairs and sofas",
            "Price and market custom furniture",
        ],
        outcomes: [
            "Average 3-month waiting list for graduates",
            "High profit margins in custom furniture",
            "Growing demand from real estate developers",
        ],
    },
    // Automotive & Mechanical
    {
        title: "Automobile Mechanic",
        category: "Automotive & Mechanical",
        description: "Comprehensive auto mechanics training covering engine diagnostics, transmission, brakes, suspension and modern vehicle systems. Graduates work in workshops or establish their own.",
        objectives: [
            "Diagnose and repair engine and transmission faults",
            "Service brakes, suspension and steering systems",
            "Use diagnostic tools and computer systems",
            "Manage a vehicle workshop",
        ],
        outcomes: [
            "High demand — Nigeria has millions of vehicles",
            "60% establish own workshops",
            "Strong repeat customer business model",
        ],
    },
    {
        title: "Motorcycle & Tricycle Repair",
        category: "Automotive & Mechanical",
        description: "Specialised training in motorcycle and Keke Napep tricycle mechanics, covering engine repair, electrical systems and chassis maintenance.",
        objectives: [
            "Service and overhaul motorcycle engines",
            "Repair tricycle (Keke) transmission and chassis",
            "Diagnose electrical faults",
            "Run a motorcycle repair business",
        ],
        outcomes: [
            "Massive market — motorcycles ubiquitous in Nigeria",
            "Quick path to self-employment",
            "Low tooling cost to start",
        ],
    },
    {
        title: "Vulcanising & Tire Repair",
        category: "Automotive & Mechanical",
        description: "Training in tire repair, retreading, wheel balancing, alignment and vulcanising for all vehicle types. Low startup cost with high demand in Nigerian transport sector.",
        objectives: [
            "Repair and patch all tire types",
            "Perform wheel balancing and alignment",
            "Operate vulcanising equipment",
            "Manage a tire workshop",
        ],
        outcomes: [
            "Very low startup cost",
            "Immediate self-employment possible",
            "High traffic volume ensures steady income",
        ],
    },
    {
        title: "Refrigeration & Air-Conditioning",
        category: "Automotive & Mechanical",
        description: "Technical training in the installation, servicing and repair of domestic refrigerators, chest freezers, split-unit and window air conditioners.",
        objectives: [
            "Install and service split-unit and window ACs",
            "Diagnose and repair refrigerator faults",
            "Handle refrigerants safely and legally",
            "Wire and connect electrical components",
        ],
        outcomes: [
            "Extreme demand in hot Nigerian climate",
            "Strong residential and commercial market",
            "Average of 5+ service calls per week for graduates",
        ],
    },
    {
        title: "Solar PV Installation & Maintenance",
        category: "Automotive & Mechanical",
        description: "Training in solar panel installation, battery storage systems, inverter setup and maintenance. One of the fastest-growing skills in Nigeria due to power supply challenges.",
        objectives: [
            "Size and design solar PV systems",
            "Install panels, batteries and inverters",
            "Wire and connect solar systems safely",
            "Maintain and fault-find solar installations",
        ],
        outcomes: [
            "Rapidly growing market in Nigeria",
            "Immediate employment opportunities",
            "High earning potential — residential and commercial",
        ],
    },
    {
        title: "Automobile CNG Conversion & Maintenance",
        category: "Automotive & Mechanical",
        description: "Specialised training in converting petrol vehicles to Compressed Natural Gas (CNG) and maintaining CNG systems — a critical skill as Nigeria transitions to gas-powered transport.",
        objectives: [
            "Convert petrol engines to CNG safely",
            "Install and commission CNG kits",
            "Diagnose and repair CNG system faults",
            "Understand CNG safety regulations",
        ],
        outcomes: [
            "Federal government CNG push creates huge demand",
            "Scarce skill — very high earning potential",
            "Placement with fuel companies possible",
        ],
    },
    {
        title: "Mechanised Agriculture (Mechanics or Operations)",
        category: "Automotive & Mechanical",
        description: "Training in the operation and maintenance of agricultural machinery including tractors, tillers, harvesters and irrigation pumps.",
        objectives: [
            "Operate and maintain farm tractors",
            "Service tillers, planters and harvesters",
            "Maintain irrigation pump systems",
            "Basic farm machinery diagnostics",
        ],
        outcomes: [
            "Growing agric sector demand",
            "State government agric programs need skilled operators",
            "Good rural employment opportunities",
        ],
    },
    // Technology & Networks
    {
        title: "Network System Installation",
        category: "Technology & Networks",
        description: "Training in structured cabling, LAN/WAN network installation, Wi-Fi setup, CCTV and access control systems for commercial and residential buildings.",
        objectives: [
            "Install structured cabling and network equipment",
            "Configure routers, switches and Wi-Fi systems",
            "Install CCTV and access control systems",
            "Carry out network troubleshooting",
        ],
        outcomes: [
            "High demand in tech-driven construction",
            "Good rates for commercial network projects",
            "60% placed with ICT/security firms",
        ],
    },
    {
        title: "Computer Hardware & GSM Repair & Maintenance",
        category: "Technology & Networks",
        description: "Practical training in laptop/desktop hardware repair, motherboard-level diagnostics, mobile phone repairs, and software installation.",
        objectives: [
            "Diagnose and repair laptop and desktop hardware",
            "Perform motherboard-level phone and PC repairs",
            "Install and configure operating systems and software",
            "Run a computer/phone repair business",
        ],
        outcomes: [
            "Very low startup cost",
            "Immediate self-employment possible",
            "High volume — every household has phones/computers",
        ],
    },
    {
        title: "Creative Media (Digital Media Production)",
        category: "Technology & Networks",
        description: "Training in photography, videography, video editing, graphic design and social media content creation for business and personal brand purposes.",
        objectives: [
            "Capture and edit professional photos and video",
            "Design graphics using Adobe and Canva tools",
            "Produce content for social media and marketing",
            "Build a creative freelance business",
        ],
        outcomes: [
            "Growing demand for content creators",
            "Freelancing income possible from first month",
            "Multiple revenue streams — weddings, brands, social media",
        ],
    },
    // Media & Communications
    {
        title: "Social Media Communications",
        category: "Media & Communications",
        description: "Training in social media strategy, content creation, community management, paid advertising and personal branding for businesses and individuals.",
        objectives: [
            "Develop social media strategies for businesses",
            "Create engaging content for key platforms",
            "Manage communities and customer engagement",
            "Run paid social media ad campaigns",
        ],
        outcomes: [
            "Immediate freelancing possible",
            "High demand from SMEs",
            "Remote work opportunities",
        ],
    },
    // Agriculture
    {
        title: "Livestock Farming (Bee Keeping, Poultry & Animal Husbandry)",
        category: "Agriculture",
        description: "Training in poultry management, pig and goat farming, bee keeping and general animal husbandry for commercial production.",
        objectives: [
            "Manage commercial poultry and livestock operations",
            "Set up and manage a bee keeping enterprise",
            "Apply veterinary first aid and disease prevention",
            "Market livestock and animal products",
        ],
        outcomes: [
            "Food security sector with government support",
            "Relatively low startup for poultry",
            "Consistent demand for animal protein",
        ],
    },
    // Fashion & Beauty
    {
        title: "Fashion Design & Garment Making",
        category: "Fashion & Beauty",
        description: "Training in pattern making, garment construction, fashion illustration, fabric selection and the business of fashion — with a focus on both African fashion and ready-to-wear.",
        objectives: [
            "Create patterns and construct garments",
            "Use industrial and domestic sewing machines",
            "Apply African print and fabric design principles",
            "Build and manage a fashion business",
        ],
        outcomes: [
            "80% self-employed within 4 months",
            "Strong clientele within first month",
            "Average monthly revenue exceeds minimum wage",
        ],
    },
    {
        title: "Beauty Therapy & Cosmetology",
        category: "Fashion & Beauty",
        description: "Professional training in hair styling, braiding, locs, makeup artistry, skincare, manicure, pedicure and salon management.",
        objectives: [
            "Master hair styling, braiding and loc techniques",
            "Apply professional makeup for events and photoshoots",
            "Provide skincare and nail care services",
            "Run a profitable beauty salon or mobile service",
        ],
        outcomes: [
            "Immediate income from first clients",
            "Low startup for mobile beauty service",
            "Strong female economic empowerment outcomes",
        ],
    },
    // Hospitality
    {
        title: "Hospitality Training",
        category: "Hospitality",
        description: "Training in food and beverage service, hotel front office operations, housekeeping, catering and event management for the hospitality industry.",
        objectives: [
            "Deliver professional food and beverage service",
            "Manage hotel front office and housekeeping",
            "Plan and execute catering for events",
            "Understand hospitality industry standards",
        ],
        outcomes: [
            "Placement with hotels and event companies",
            "Catering self-employment possible",
            "Strong demand from growing hospitality sector",
        ],
    },
];
const centers = [
    {
        name: "Port Harcourt Training Center",
        slug: "port-harcourt",
        code: "PH",
        state: "Rivers State",
        address: "Adele Foundation Complex, Trans-Amadi Industrial Layout, Port Harcourt, Rivers State",
        phone: "+234 084 000 001",
        email: "portharcourt@adelefoundation.org",
    },
    {
        name: "Bayelsa Training Center",
        slug: "bayelsa",
        code: "BY",
        state: "Bayelsa State",
        address: "Adele Foundation Annex, Swali Market Road, Yenagoa, Bayelsa State",
        phone: "+234 089 000 001",
        email: "bayelsa@adelefoundation.org",
    },
];
async function seed() {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose_1.default.connect(MONGODB_URI, { dbName: "adele-foundation" });
    console.log("✅ Connected");
    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Promise.all([
        user_model_1.default.deleteMany({}),
        center_model_1.Center.deleteMany({}),
        program_model_1.Program.deleteMany({}),
    ]);
    // Create super admin
    console.log("👤 Creating super admin...");
    const superAdmin = await user_model_1.default.create({
        fullName: "Foundation Admin",
        email: "admin@adelefoundation.org",
        password: await (0, auth_1.hashPassword)("Adele2025!"),
        role: "super_admin",
    });
    console.log("   ✅ Super admin: admin@adelefoundation.org / Adele2025!");
    // Create centers
    console.log("🏢 Creating training centers...");
    const createdCenters = await center_model_1.Center.insertMany(centers);
    createdCenters.forEach((c) => console.log(`   ✅ ${c.name} [${c.code}]`));
    // Create programs
    console.log("📚 Creating 25 skill programs...");
    const createdPrograms = await program_model_1.Program.insertMany(programs.map((p) => ({
        ...p,
        slug: p.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        createdBy: superAdmin._id,
    })));
    console.log(`   ✅ ${createdPrograms.length} programs created`);
    // Assign all programs to both centers
    console.log("🔗 Assigning programs to centers...");
    const allProgramIds = createdPrograms.map((p) => p._id);
    await center_model_1.Center.updateMany({}, { programs: allProgramIds });
    console.log("   ✅ All programs assigned to both centers");
    // Create program officer for each center
    console.log("👥 Creating program officers...");
    for (const center of createdCenters) {
        await user_model_1.default.create({
            fullName: `${center.name} Officer`,
            email: `officer.${center.code.toLowerCase()}@adelefoundation.org`,
            password: await (0, auth_1.hashPassword)("Officer2025!"),
            role: "program_officer",
            centerId: center._id,
        });
        console.log(`   ✅ officer.${center.code.toLowerCase()}@adelefoundation.org / Officer2025!`);
    }
    // Create blog editor
    await user_model_1.default.create({
        fullName: "Blog Editor",
        email: "editor@adelefoundation.org",
        password: await (0, auth_1.hashPassword)("Editor2025!"),
        role: "blog_editor",
    });
    console.log("   ✅ editor@adelefoundation.org / Editor2025!");
    console.log(`
╔═══════════════════════════════════════════════════════╗
║   ✅ Seed Complete                                    ║
╠═══════════════════════════════════════════════════════╣
║   Super Admin:                                        ║
║   admin@adelefoundation.org / Adele2025!              ║
║                                                       ║
║   PH Officer:                                         ║
║   officer.ph@adelefoundation.org / Officer2025!       ║
║                                                       ║
║   Bayelsa Officer:                                    ║
║   officer.by@adelefoundation.org / Officer2025!       ║
║                                                       ║
║   Blog Editor:                                        ║
║   editor@adelefoundation.org / Editor2025!            ║
║                                                       ║
║   Programs:  25                                       ║
║   Centers:   2 (PH + Bayelsa)                         ║
╚═══════════════════════════════════════════════════════╝
  `);
    await mongoose_1.default.disconnect();
    process.exit(0);
}
seed().catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map