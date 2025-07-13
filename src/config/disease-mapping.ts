interface DiseaseMapping {
  classIndex: number;
  name: string;
  description: string;
  symptoms: string[];
  plantType: string;
  treatments: {
    name: string;
    description: string;
    steps: string[];
  }[];
}

// This mapping matches your actual training data structure
// Based on the folders found in /home/hsh/Documents/ME/ayar-care-be/training_data
export const diseaseMapping: DiseaseMapping[] = [
  {
    classIndex: 0,
    name: 'Apple Scab',
    description: 'A fungal disease that affects apple trees, causing scabby lesions on leaves and fruit.',
    symptoms: ['Dark spots on leaves', 'Cracked fruit', 'Premature leaf drop'],
    plantType: 'Apple',
    treatments: [
      {
        name: 'Cultural Control',
        description: 'Implement cultural practices to manage apple scab',
        steps: [
          'Rake and remove fallen leaves',
          'Prune for better air circulation',
          'Apply fungicide in spring',
          'Use resistant varieties'
        ]
      }
    ]
  },
  {
    classIndex: 1,
    name: 'Apple Black Rot',
    description: 'A fungal disease that causes black rot on apple fruit and leaves.',
    symptoms: ['Black rot on fruit', 'Leaf spots', 'Cankers on branches'],
    plantType: 'Apple',
    treatments: [
      {
        name: 'Fungicide Application',
        description: 'Apply fungicide to control black rot',
        steps: [
          'Remove infected fruit and leaves',
          'Apply fungicide',
          'Prune infected branches',
          'Improve air circulation'
        ]
      }
    ]
  },
  {
    classIndex: 2,
    name: 'Apple Cedar Rust',
    description: 'A fungal disease that affects apple trees, causing orange spots on leaves.',
    symptoms: ['Orange spots on leaves', 'Fruit distortion', 'Premature leaf drop'],
    plantType: 'Apple',
    treatments: [
      {
        name: 'Rust Management',
        description: 'Manage cedar rust through cultural and chemical controls',
        steps: [
          'Remove nearby cedar trees',
          'Apply fungicide in spring',
          'Use resistant varieties',
          'Improve air circulation'
        ]
      }
    ]
  },
  {
    classIndex: 3,
    name: 'Apple Healthy',
    description: 'A healthy apple tree showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Apple',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain tree health through proper care',
        steps: [
          'Regular pruning',
          'Proper fertilization',
          'Adequate irrigation',
          'Pest monitoring'
        ]
      }
    ]
  },
  {
    classIndex: 4,
    name: 'Background Without Leaves',
    description: 'Image contains no plant material - background only.',
    symptoms: ['No plant visible'],
    plantType: 'None',
    treatments: [
      {
        name: 'No Treatment Required',
        description: 'This is not a plant disease - retake photo focusing on plant leaves',
        steps: [
          'Retake photo with plant leaves visible',
          'Ensure good lighting',
          'Focus on affected plant parts',
          'Try a different angle'
        ]
      }
    ]
  },
  {
    classIndex: 5,
    name: 'Blueberry Healthy',
    description: 'A healthy blueberry plant showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Blueberry',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain plant health through proper care',
        steps: [
          'Maintain acidic soil (pH 4.5-5.5)',
          'Provide adequate water',
          'Mulch around plants',
          'Regular pruning'
        ]
      }
    ]
  },
  {
    classIndex: 6,
    name: 'Cherry Healthy',
    description: 'A healthy cherry tree showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Cherry',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain tree health through proper care',
        steps: [
          'Regular pruning',
          'Proper fertilization',
          'Adequate irrigation',
          'Pest monitoring'
        ]
      }
    ]
  },
  {
    classIndex: 7,
    name: 'Corn Common Rust',
    description: 'A fungal disease that causes rust-colored pustules on corn leaves.',
    symptoms: ['Rust-colored pustules', 'Leaf yellowing', 'Reduced yield'],
    plantType: 'Corn',
    treatments: [
      {
        name: 'Rust Control',
        description: 'Control common rust through cultural and chemical means',
        steps: [
          'Use resistant varieties',
          'Apply fungicide',
          'Practice crop rotation',
          'Control plant density'
        ]
      }
    ]
  },
  {
    classIndex: 8,
    name: 'Corn Healthy',
    description: 'A healthy corn plant showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Corn',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain plant health through proper care',
        steps: [
          'Proper fertilization',
          'Adequate irrigation',
          'Pest monitoring',
          'Weed control'
        ]
      }
    ]
  },
  {
    classIndex: 9,
    name: 'Corn Northern Leaf Blight',
    description: 'A fungal disease that causes long, gray-green lesions on corn leaves.',
    symptoms: ['Long gray-green lesions', 'Leaf death', 'Reduced yield'],
    plantType: 'Corn',
    treatments: [
      {
        name: 'Blight Management',
        description: 'Manage northern leaf blight through cultural and chemical controls',
        steps: [
          'Use resistant varieties',
          'Apply fungicide',
          'Practice crop rotation',
          'Control plant density'
        ]
      }
    ]
  },
  {
    classIndex: 10,
    name: 'Grape Black Rot',
    description: 'A fungal disease that affects grape vines, causing black rot on fruit and leaves.',
    symptoms: ['Black rot on fruit', 'Leaf spots', 'Cankers on stems'],
    plantType: 'Grape',
    treatments: [
      {
        name: 'Fungicide Application',
        description: 'Apply fungicide to control black rot',
        steps: [
          'Remove infected fruit and leaves',
          'Apply fungicide',
          'Prune infected canes',
          'Improve air circulation'
        ]
      }
    ]
  },
  {
    classIndex: 11,
    name: 'Grape Esca (Black Measles)',
    description: 'A fungal disease that causes wood decay in grape vines.',
    symptoms: ['Wood decay', 'Leaf yellowing', 'Reduced vigor', 'Black spots on leaves'],
    plantType: 'Grape',
    treatments: [
      {
        name: 'Cultural Control',
        description: 'Implement cultural practices to manage esca',
        steps: [
          'Prune infected wood',
          'Apply fungicide to pruning wounds',
          'Improve air circulation',
          'Control irrigation'
        ]
      }
    ]
  },
  {
    classIndex: 12,
    name: 'Grape Healthy',
    description: 'A healthy grape vine showing no signs of disease.',
    symptoms: ['No symptoms'],
    plantType: 'Grape',
    treatments: [
      {
        name: 'Preventive Care',
        description: 'Maintain vine health through proper care',
        steps: [
          'Regular pruning',
          'Proper fertilization',
          'Adequate irrigation',
          'Pest monitoring'
        ]
      }
    ]
  },
  {
    classIndex: 13,
    name: 'Grape Leaf Blight (Isariopsis Leaf Spot)',
    description: 'A fungal disease that causes blight on grape leaves.',
    symptoms: ['Leaf spots', 'Leaf death', 'Reduced vigor', 'Brown lesions'],
    plantType: 'Grape',
    treatments: [
      {
        name: 'Blight Control',
        description: 'Control leaf blight through cultural and chemical means',
        steps: [
          'Remove infected leaves',
          'Apply fungicide',
          'Improve air circulation',
          'Control irrigation'
        ]
      }
    ]
  }
];


// export const diseaseMapping: DiseaseMapping[] = [
//   {
//     classIndex: 0,
//     name: 'ပန်းသီး ညှိုးနွမ်းရောဂါ',
//     description: 'ပန်းသီးပင်၏ မှိုရောဂါတစ်မျိုးဖြစ်ပြီး အရွက်နှင့် အသီးများတွင် အနာကွက်များဖြစ်စေသည်။',
//     symptoms: ['အရွက်များပေါ်တွင် အမည်းစက်များ', 'အသီးကွဲခြင်း', 'အရွက်များ အချိန်မတိုင်မီ ကြွေခြင်း'],
//     plantType: 'ပန်းသီး',
//     treatments: [
//       {
//         name: 'ယဉ်ကျေးမှုထိန်းချုပ်နည်း',
//         description: 'ပန်းသီး ညှိုးနွမ်းရောဂါကို ကိုင်တွယ်ဖြေရှင်းရန် ယဉ်ကျေးမှုဆိုင်ရာ နည်းလမ်းများ',
//         steps: [
//           'ကြွေကျနေသော အရွက်များကို ရှင်းလင်းပါ',
//           'လေဝင်လေထွက်ကောင်းစေရန် ပြုပြင်ဖြတ်တောက်ပါ',
//           'နွေဦးရာသီတွင် မှိုသတ်ဆေးဖြန်းပါ',
//           'ခံနိုင်ရည်ရှိသော မျိုးကို အသုံးပြုပါ'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 1,
//     name: 'ပန်းသီး အမည်းရောင် ပုပ်ရောဂါ',
//     description: 'ပန်းသီးအသီးနှင့် အရွက်များတွင် အမည်းရောင် ပုပ်ရောဂါဖြစ်စေသော မှိုရောဂါတစ်မျိုး',
//     symptoms: ['အသီးပုပ်ခြင်း', 'အရွက်ပေါ်တွင် အစက်များ', 'အကိုင်းများပေါ်တွင် အနာကွက်များ'],
//     plantType: 'ပန်းသီး',
//     treatments: [
//       {
//         name: 'မှိုသတ်ဆေး အသုံးပြုခြင်း',
//         description: 'အမည်းရောင် ပုပ်ရောဂါကို ထိန်းချုပ်ရန် မှိုသတ်ဆေးဖြန်းခြင်း',
//         steps: [
//           'ရောဂါကူးစက်နေသော အသီးနှင့် အရွက်များကို ဖယ်ရှားပါ',
//           'မှိုသတ်ဆေးဖြန်းပါ',
//           'ရောဂါကူးစက်နေသော အကိုင်းများကို ဖြတ်တောက်ပါ',
//           'လေဝင်လေထွက်ကောင်းစေရန် ပြုလုပ်ပါ'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 2,
//     name: 'ပန်းသီး အာရဇီုန် မှိုရောဂါ',
//     description: 'ပန်းသီးပင်များတွင် ဖြစ်ပွားသော မှိုရောဂါတစ်မျိုးဖြစ်ပြီး အရွက်များပေါ်တွင် လိမ္မော်ရောင် အစက်များဖြစ်ပေါ်စေသည်။',
//     symptoms: ['အရွက်များပေါ်တွင် လိမ္မော်ရောင် အစက်များ', 'အသီး ပုံပျက်ခြင်း', 'အရွက်များ အချိန်မတိုင်မီ ကြွေခြင်း'],
//     plantType: 'ပန်းသီး',
//     treatments: [
//       {
//         name: 'အာရဇီုန် ရောဂါ စီမံခန့်ခွဲမှု',
//         description: 'ယဉ်ကျေးမှုနှင့် ဓာတုဆိုင်ရာ နည်းလမ်းများဖြင့် အာရဇီုန် မှိုရောဂါကို ကိုင်တွယ်ဖြေရှင်းခြင်း',
//         steps: [
//           'အနီးအနားရှိ အာရဇီုန်ပင် များကို ဖယ်ရှားပါ',
//           'နွေဦးရာသီတွင် မှိုသတ်ဆေးဖြန်းပါ',
//           'ခံနိုင်ရည်ရှိသော မျိုးကို အသုံးပြုပါ',
//           'လေဝင်လေထွက်ကောင်းစေရန် ပြုလုပ်ပါ'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 3,
//     name: 'ကျန်းမာသော ပန်းသီးပင်',
//     description: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ပန်းသီးပင်',
//     symptoms: ['ရောဂါလက္ခဏာ မရှိပါ'],
//     plantType: 'ပန်းသီး',
//     treatments: [
//       {
//         name: 'ကာကွယ်ရေး စောင့်ရှောက်မှု',
//         description: 'သင့်လျော်သော စောင့်ရှောက်မှုဖြင့် ပန်းပင်ကျန်းမာရေးကို ထိန်းသိမ်းခြင်း',
//         steps: [
//           'ပုံမှန် ပြုပြင်ဖြတ်တောက်ခြင်း',
//           'မြေဩဇာ သင့်တင့်မျှတစွာ ထည့်သွင်းခြင်း',
//           'လိုအပ်သော ရေပေးသွင်းခြင်း',
//           'ပိုးမွှားများ စောင့်ကြည့်ခြင်း'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 4,
//     name: 'အရွက်မပါသော နောက်ခံ',
//     description: 'အပင်အစိတ်အပိုင်းများ မပါဝင်သော နောက်ခံသက်သက်ဖြစ်သည်။',
//     symptoms: ['အပင်များ မမြင်ရပါ'],
//     plantType: 'မရှိပါ',
//     treatments: [
//       {
//         name: 'ကုသမှု မလိုအပ်ပါ',
//         description: 'ဤအရာသည် အပင်ရောဂါမဟုတ်ပါ - အပင်အရွက်များကို အာရုံစိုက်ပြီး ဓာတ်ပုံပြန်ရိုက်ပါ',
//         steps: [
//           'အပင်အရွက်များ မြင်နိုင်သော ဓာတ်ပုံပြန်ရိုက်ပါ',
//           'အလင်းရောင်ကောင်းစွာရပါစေ',
//           'ထိခိုက်နေသော အပင်အစိတ်အပိုင်းများကို အာရုံစိုက်ပါ',
//           'မတူညီသော ရှုထောင့်မှ ပြန်ရိုက်ကြည့်ပါ'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 5,
//     name: 'ကျန်းမာသော ဘလူးဘယ်ရီပင်�',
//     description: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ဘလူးဘယ်ရီပင်များ',
//     symptoms: ['ရောဂါလက္ခဏာ မရှိပါ'],
//     plantType: 'ဘလူးဘယ်ရီ',
//     treatments: [
//       {
//         name: 'ကာကွယ်ရေး စောင့်ရှောက်မှု',
//         description: 'သင့်လျော်သော စောင့်ရှောက်မှုဖြင့် အပင်ကျန်းမာရေးကို ထိန်းသိမ်းခြင်း',
//         steps: [
//           'မြေအချဉ်ဓာတ် (pH 4.5-5.5) ထိန်းသိမ်းပါ',
//           'လိုအပ်သော ရေပေးသွင်းခြင်း',
//           'အပင်ပတ်လည်တွင် မြေဖုံးပါ',
//           'ပုံမှန် ပြုပြင်ဖြတ်တောက်ခြင်း'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 6,
//     name: 'ကျန်းမာသော ချယ်ရီပင်များ',
//     description: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ချယ်ရီပင်များ',
//     symptoms: ['ရောဂါလက္ခဏာ မရှိပါ'],
//     plantType: 'ချယ်ရီ',
//     treatments: [
//       {
//         name: 'ကာကွယ်ရေး စောင့်ရှောက်မှု',
//         description: 'သင့်လျော်သော စောင့်ရှောက်မှုဖြင့် အပင်ကျန်းမာရေးကို ထိန်းသိမ်းခြင်း',
//         steps: [
//           'ပုံမှန် ပြုပြင်ဖြတ်တောက်ခြင်း',
//           'မြေဩဇာ သင့်တင့်မျှတစွာ ထည့်သွင်းခြင်း',
//           'လိုအပ်သော ရေပေးသွင်းခြင်း',
//           'ပိုးမွှားများ စောင့်ကြည့်ခြင်း'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 7,
//     name: 'ပြောင်း ရိုးရိုး အာရဇီုန်ရောဂါ',
//     description: 'ပြောင်းဖူးအရွက်များပေါ်တွင် အာရဇီုန်ရောင် အဖုများဖြစ်ပေါ်စေသော မှိုရောဂါတစ်မျိုး',
//     symptoms: ['အာရဇီုန်ရောင် အဖုများ', 'အရွက်ဝါခြင်း', 'အထွက်နှုန်းလျော့ကျခြင်း'],
//     plantType: 'ပြောင်း',
//     treatments: [
//       {
//         name: 'အာရဇီုန် ရောဂါ ထိန်းချုပ်ခြင်း',
//         description: 'ယဉ်ကျေးမှုနှင့် ဓာတုဆိုင်ရာ နည်းလမ်းများဖြင့် အာရဇီုန်ရောဂါကို ကိုင်တွယ်ဖြေရှင်းခြင်း',
//         steps: [
//           'ခံနိုင်ရည်ရှိသော မျိုးကို အသုံးပြုပါ',
//           'မှိုသတ်ဆေးဖြန်းပါ',
//           'စိုက်ပျိုးမြေ လှည့်လည်အသုံးပြုခြင်း',
//           'အပင်သိပ်သည်းမှုကို ထိန်းချုပ်ပါ'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 8,
//     name: 'ကျန်းမာသော ပြောင်းပင်များ',
//     description: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော ပြောင်းပင်များ',
//     symptoms: ['ရောဂါလက္ခဏာ မရှိပါ'],
//     plantType: 'ပြောင်း',
//     treatments: [
//       {
//         name: 'ကာကွယ်ရေး စောင့်ရှောက်မှု',
//         description: 'သင့်လျော်သော စောင့်ရှောက်မှုဖြင့် အပင်ကျန်းမာရေးကို ထိန်းသိမ်းခြင်း',
//         steps: [
//           'မြေဩဇာ သင့်တင့်မျှတစွာ ထည့်သွင်းခြင်း',
//           'လိုအပ်သော ရေပေးသွင်းခြင်း',
//           'ပိုးမွှားများ စောင့်ကြည့်ခြင်း',
//           'ပေါင်းမြက် ထိန်းချုပ်ခြင်း'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 9,
//     name: 'ပြောင်း မြောက်ပိုင်း အရွက်မီးလောင်ရောဂါ',
//     description: 'ပြောင်းဖူးအရွက်များပေါ်တွင် ရှည်လျားသော မီးခိုးရောင်-အစိမ်းရောင် အနာကွက်များဖြစ်ပေါ်စေသော မှိုရောဂါတစ်မျိုး',
//     symptoms: ['ရှည်လျားသော မီးခိုးရောင်-အစိမ်းရောင် အနာကွက်များ', 'အရွက်သေခြင်း', 'အထွက်နှုန်းလျော့ကျခြင်း'],
//     plantType: 'ပြောင်း',
//     treatments: [
//       {
//         name: 'မီးလောင်ရောဂါ စီမံခန့်ခွဲမှု',
//         description: 'ယဉ်ကျေးမှုနှင့် ဓာတုဆိုင်ရာ နည်းလမ်းများဖြင့် မြောက်ပိုင်း အရွက်မီးလောင်ရောဂါကို ကိုင်တွယ်ဖြေရှင်းခြင်း',
//         steps: [
//           'ခံနိုင်ရည်ရှိသော မျိုးကို အသုံးပြုပါ',
//           'မှိုသတ်ဆေးဖြန်းပါ',
//           'စိုက်ပျိုးမြေ လှည့်လည်အသုံးပြုခြင်း',
//           'အပင်သိပ်သည်းမှုကို ထိန်းချုပ်ပါ'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 10,
//     name: 'စပျစ်သီး အမည်းရောင် ပုပ်ရောဂါ',
//     description: 'စပျစ်နွယ်ပင်များတွင် ဖြစ်ပွားသော မှိုရောဂါတစ်မျိုးဖြစ်ပြီး အသီးနှင့် အရွက်များပေါ်တွင် အမည်းရောင် ပုပ်ရောဂါဖြစ်ပေါ်စေသည်။',
//     symptoms: ['အသီးပုပ်ခြင်း', 'အရွက်ပေါ်တွင် အစက်များ', 'အကိုင်းများပေါ်တွင် အနာကွက်များ'],
//     plantType: 'စပျစ်',
//     treatments: [
//       {
//         name: 'မှိုသတ်ဆေး အသုံးပြုခြင်း',
//         description: 'အမည်းရောင် ပုပ်ရောဂါကို ထိန်းချုပ်ရန် မှိုသတ်ဆေးဖြန်းခြင်း',
//         steps: [
//           'ရောဂါကူးစက်နေသော အသီးနှင့် အရွက်များကို ဖယ်ရှားပါ',
//           'မှိုသတ်ဆေးဖြန်းပါ',
//           'ရောဂါကူးစက်နေသော အကိုင်းများကို ဖြတ်တောက်ပါ',
//           'လေဝင်လေထွက်ကောင်းစေရန် ပြုလုပ်ပါ'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 11,
//     name: 'စပျစ်သီး Esca (အမည်းရောင် ဝက်သက်)',
//     description: 'စပျစ်နွယ်ပင်များ၏ သစ်သားကို ဆွေးမြေ့စေသော မှိုရောဂါတစ်မျိုး',
//     symptoms: ['သစ်သား ဆွေးမြေ့ခြင်း', 'အရွက်ဝါခြင်း', 'ကြီးထွားမှု နှေးကွေးခြင်း', 'အရွက်များပေါ်တွင် အမည်းစက်များ'],
//     plantType: 'စပျစ်',
//     treatments: [
//       {
//         name: 'ယဉ်ကျေးမှုထိန်းချုပ်နည်း',
//         description: 'Esca ရောဂါကို ကိုင်တွယ်ဖြေရှင်းရန် ယဉ်ကျေးမှုဆိုင်ရာ နည်းလမ်းများ',
//         steps: [
//           'ရောဂါကူးစက်နေသော သစ်သားများကို ဖြတ်တောက်ပါ',
//           'ဖြတ်တောက်ထားသော အနာများပေါ်တွင် မှိုသတ်ဆေးဖြန်းပါ',
//           'လေဝင်လေထွက်ကောင်းစေရန် ပြုလုပ်ပါ',
//           'ရေပေးသွင်းမှုကို ထိန်းချုပ်ပါ'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 12,
//     name: 'ကျန်းမာသော စပျစ်နွယ်ပင်များ',
//     description: 'ရောဂါလက္ခဏာ မပြသော ကျန်းမာသော စပျစ်နွယ်ပင်များ',
//     symptoms: ['ရောဂါလက္ခဏာ မရှိပါ'],
//     plantType: 'စပျစ်',
//     treatments: [
//       {
//         name: 'ကာကွယ်ရေး စောင့်ရှောက်မှု',
//         description: 'သင့်လျော်သော စောင့်ရှောက်မှုဖြင့် နွယ်ပင်ကျန်းမာရေးကို ထိန်းသိမ်းခြင်း',
//         steps: [
//           'ပုံမှန် ပြုပြင်ဖြတ်တောက်ခြင်း',
//           'မြေဩဇာ သင့်တင့်မျှတစွာ ထည့်သွင်းခြင်း',
//           'လိုအပ်သော ရေပေးသွင်းခြင်း',
//           'ပိုးမွှားများ စောင့်ကြည့်ခြင်း'
//         ]
//       }
//     ]
//   },
//   {
//     classIndex: 13,
//     name: 'စပျစ်သီး အရွက်မီးလောင်ရောဂါ (Isariopsis အရွက်အစက်ရောဂါ)',
//     description: 'စပျစ်ရွက်များပေါ်တွင် မီးလောင်ရောဂါဖြစ်ပေါ်စေသော မှိုရောဂါတစ်မျိုး',
//     symptoms: ['အရွက်ပေါ်တွင် အစက်များ', 'အရွက်သေခြင်း', 'ကြီးထွားမှု နှေးကွေးခြင်း', 'အညိုရောင် အနာကွက်များ'],
//     plantType: 'စပျစ်',
//     treatments: [
//       {
//         name: 'မီးလောင်ရောဂါ ထိန်းချုပ်ခြင်း',
//         description: 'ယဉ်ကျေးမှုနှင့် ဓာတုဆိုင်ရာ နည်းလမ်းများဖြင့် အရွက်မီးလောင်ရောဂါကို ကိုင်တွယ်ဖြေရှင်းခြင်း',
//         steps: [
//           'ရောဂါကူးစက်နေသော အရွက်များကို ဖယ်ရှားပါ',
//           'မှိုသတ်ဆေးဖြန်းပါ',
//           'လေဝင်လေထွက်ကောင်းစေရန် ပြုလုပ်ပါ',
//           'ရေပေးသွင်းမှုကို ထိန်းချုပ်ပါ'
//         ]
//       }
//     ]
//   }
// ];
// Helper function to get disease info by class index
export function getDiseaseByClassIndex(classIndex: number): DiseaseMapping | undefined {
  return diseaseMapping.find(disease => disease.classIndex === classIndex);
}
