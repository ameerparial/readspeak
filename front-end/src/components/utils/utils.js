export function getResult(lanCountry, countryCode) {
  const sBreakIndex = lanCountry.indexOf("(");

  let result = "";

  if (sBreakIndex === -1) {
    result = lanCountry;
  } else {
    result = lanCountry.substring(0, sBreakIndex).trim();
  }

  const index = countryCode.indexOf("-");

  if (index !== -1) {
    result = `${result} (${countryCode.substring(index + 1)})`;
  }

  return result;
}

export function getUniqueItems(voices) {
  const set = new Set();
  const indices = [];
  voices.forEach((voice, index) => {
    const result = getResult(voice.privLocaleName, voice.privLocale);
    if (!set.has(result)) {
      set.add(result);
      indices.push(index);
    }
  });
  const uniqueList = [...set];
  return [uniqueList, indices];
}

export const getMatchedVoices = (startIndex, endIndex, voices) => {
  const last = endIndex || voices.length;
  const newArr = [];
  for (let i = startIndex; i < last; i++) {
    newArr.push(voices[i]);
  }
  return newArr;
};

export const indexOfCountryList = (voice, voices) => {
  const result = getResult(voice.privLocaleName, voice.privLocale);
  return voices.findIndex((v) => {
    return v === result;
  });
};

export const getSpeakersWithDetails = (voices, shortnames) => {
  const result = [];

  shortnames.forEach((shortname) => {
    for (let sp = 0; sp < voices.length; sp++) {
      if (voices[sp].privShortName === shortname) {
        result.push(voices[sp]);
      }
    }
  });
  return result;
};

export const getSpeakerDetails = (voices, shortname) => {
  console.log(shortname);
  for (let sp = 0; sp < voices.length; sp++) {
    if (voices[sp].privShortName === shortname) {
      console.log(voices[sp]);
      return voices[sp];
    }
  }
};
