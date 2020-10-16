import axios from "axios";
import dotenv from "dotenv";

export const translate = ({source, target, query}) => 
    axios.post("https://openapi.naver.com/v1/papago/n2mt", {
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET
        },
        data: {
            source: source,
            target: target,
            text: query
        }
    });