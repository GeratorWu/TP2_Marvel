import {createHash} from 'crypto'
import fetch from 'node-fetch';

/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    // A Complétera
    const publicKey = "374514abedf02316076969f0d8b971e1";
    const privateKey = "ca8924646dd732699f6f08fd037a6bcb31972fb7";
    const ts = new Date().getTime();
    const hash = await getHash(publicKey, privateKey, ts);
    const authURL = `${url}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    const res = await fetch(authURL);

    if (!res.ok) {
        throw new Error(`Erreur HTTP : ${res.status}`);
    }

    const dataMarvel = await res.json();
    const { results } = dataMarvel.data || {};
    if(results && Array.isArray(results)){

        const excludedKeywords = ['image_not_available'];

        const charactersWithValidThumbnail = results.filter(character =>
            !excludedKeywords.some(keyword => character.thumbnail.path.includes(keyword))
        );

        const characters = charactersWithValidThumbnail.map(character => ({
            name: character.name,
            description: character.description,
            imageUrl: `${character.thumbnail.path}/portrait_xlarge.${character.thumbnail.extension}`
        }));

        console.log(characters);
        return characters;
    }
    else{
        console.log("Aucun résultat trouvé dans la réponse de l'API Marvel.");
        return null;
    }

}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    // A compléter
    const Hash = createHash("md5").update(timestamp + privateKey + publicKey).digest('hex');
    return Hash;
}