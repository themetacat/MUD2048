// import * as qs from 'qs';


export const getGradeList = async () => {
    // const search = qs.stringify({  }, { addQueryPrefix: true });
    const url = `http://47.243.184.241/api/v1/mud_game/2048_top_score`;
  
    const res = await fetch(url);
    const json = await res.json();
  
    return json;
  };