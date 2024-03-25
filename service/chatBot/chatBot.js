require("dotenv").config({ path: '/Users/shin-uijin/InvestSNS/Invest-SNS-Express/.env'});
const OpenAI = require("openai");

const openai = new OpenAI({
    organization: process.env.OPENAI_API_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});


async function UseGpt(prompt) {
    const completion = await openai.chat.completions.create({
        messages: [{"role": "system", "content": "다음 지표에 대해서 설명해주세요."},{ role: "user", content: `${prompt} 활용사례 3가지와 함께 알려줘.` }],
        model: process.env.OPENAI_API_MODEL,
        temperature : 0.5,
    });
    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content;
}

module.exports =  UseGpt;