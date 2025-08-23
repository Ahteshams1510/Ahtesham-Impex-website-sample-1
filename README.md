# Ahtesham-Impex-website-sample-1
website sample
export default function AhteshamImpexDemo() {
// ------------------------------
// Basic site data (edit freely)
// ------------------------------
const site = {
name: "Ahtesham Impex",
tagline: "Your Trust is Our Responsibility",
email: "sales@ahteshamimpex.com",
phone: "+91-00000-00000",
whatsapp: "+919999999999", // use full international format without + for wa.me link if needed
address: "Mumbai, India",
logoUrl:
"https://placehold.co/200x60?text=Ahtesham+Impex+Logo" /* TODO: replace with your real logo URL (e.g., /assets/logo.png) */,
};


// ---------------------------------
// Product catalog (sample content)
// ---------------------------------
const products = [
{
id: "red-split",
name: "Red Split Lentils (Masoor Dal)",
image:
"https://images.unsplash.com/photo-1586201375754-1421e0aa2fda?auto=format&fit=crop&w=800&q=60", // TODO: replace with /assets/1-Lentils-Split-Red.jpg
description:
"Premium grade, machine-cleaned red split lentils. Moisture < 12%, max impurities < 0.5%.",
origin: "India",
packaging: "25/50 kg PP bags or as required",
hsCode: "0713.40",
moq: "1 x 20' FCL",
},
{
id: "yellow-lentils",
name: "Yellow Lentils",
image:
"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=60",
description:
"Uniform size, double-polished, export quality yellow lentils.",
origin: "India",
packaging: "25/50 kg PP bags",
hsCode: "0713.40",
moq: "1 x 20' FCL",
},
{
id: "brown-lentils",
name: "Brown Whole Lentils",
image:
"https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=60",
description:
"Whole brown lentils – machine cleaned, low admixture.",
origin: "India",
packaging: "25/50 kg PP bags",
hsCode: "0713.40",
moq: "1 x 20' FCL",
},
{
id: "chickpeas",
name: "Chickpeas (Kabuli / Desi)",
image:
"https://images.unsplash.com/photo-1615485737651-6e52611159af?auto=format&fit=crop&w=800&q=60",
description:
"High protein chickpeas suitable for hummus and snacks. Multiple calibers available.",
origin: "India",
packaging: "25/50 kg PP bags",
hsCode: "0713.20",
moq: "1 x 20' FCL",
},
{
id: "green-split-peas",
name: "Green Split Peas",
}
