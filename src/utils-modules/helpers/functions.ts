import { LocationDto } from "@modules/shipments/domain/dtos/location.dto";
import { CustomError } from "./customError";
import cities from "@utils/data/cities.json";
const NodeGeocoder = require("node-geocoder");


export async function validateLocation(location: LocationDto): Promise<LocationDto> {
    // Validate city
    const isValidCity = cities.some(
        (c) => c.keyword === location.city && c.department === location.department
    );
    if (!isValidCity) {
        throw new CustomError(`La ciudad ${location.city} no es válida`, 400);
    }

    // Validate address regex
    const addressRegex =
        /^(Autopista|Avenida|Avenida Calle|Avenida Carrera|Avenida|Carrera|Calle|Carrera|Circunvalar|Diagonal|Kilometro|Transversal|AUTOP|AV|AC|AK|CL|KR|CCV|DG|KM|TV)(\s)?([a-zA-Z]{0,15}|[0-9]{1,3})(\s)?[a-zA-Z]?(\s)?(bis)?(\s)?(Este|Norte|Occidente|Oeste|Sur)?(\s)?(#(\s)?[0-9]{1,2}(\s)?[a-zA-Z]?(\s)?(bis)?(\s)?(Este|Norte|Occidente|Oeste|Sur)?(\s)?(-)?(\s)?[0-9]{1,3}(\s)?(Este|Norte|Occidente|Oeste|Sur)?)?((\s)?(Agrupación|Altillo|Apartamento|Apartamento Sótano|Barrio|Bloque|Bodega|Cabecera Municipal|Callejón|Camino|Carretera|Casa|Caserio|Célula|Centro|Centro Comercial|Centro Urbano|Circular|Condominio|Conjunto|Consultorio|Corregimiento|Deposito|Deposito |Sótano|Edificio|Entrada|Esquina|Etapa|Finca|Garaje|Garaje Sótano|Grada|Inferior|Inspección de Policia|Interior|Kilometro|Local|Local Mezzanine|Local Sótano|Lote|Manzana|Manzanita|Mejora|Mezzanine|Módulo|Municipio|Núcleo|Oficina|Oficina Sótano|Parcela|Parcelación|Pasaje|Penthouse|Piso|Porteria|Predio|Principal|Puente|Quebrada|Salon|Sector|Semisótano|Suite|Supermanzana|Terraza|Torre|Troncal|Unidad|Urbanización|Vereda|Via|Zona|AGN|AL|APTO|AS|BR|BL|BG|CM|CLJ|CN|CT|CA|CAS|CEL|CE|CECO|CEUR|CIR|CDM|CONJ|CS|CO|DP|DS|ED|EN|ESQ|ET|FCA|GJ|GS|GR|INF|IP|IN|KM|LC|LM|LS|LT|MZ|MZTA|MJ|MN|MD|MUN|NCO|OF|OS|PA|PCN|PSJ|PH|PI|PT|PD|PPAL|PN|QDA|SA|SEC|SS|SU|SMZ|TZ|TO|TRL|UN|URB|VDA|VIA|ZN)?(\s)?[1-9][0-9]{0,3})*$/i;
    if (!addressRegex.test(location.address)) {
        throw new CustomError("La dirección no es válida", 400);
    }

    // Validate coordinates
    const geocoder = NodeGeocoder({
        provider: process.env.GEOCODER_PROVIDER_NAME,
        apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
        formatter: null,
    });

    try {
        const [loc] = await geocoder.geocode(`${location.address} ${location.city} ${location.department}`);
        if (!loc) {
            throw new CustomError("Dirección no encontrada", 400);
        }

        if (loc.country !== "Colombia") {
            throw new CustomError("La dirección debe ser en Colombia", 400);
        }

        if ( loc.state && loc.state !== location.department) {
            throw new CustomError(`La dirección no pertenece al departamento de ${location.department}`, 400);
        }

        if ( loc.city && loc.city !== location.city) {
            throw new CustomError(`La dirección no pertenece a la ciudad de ${location.city}`, 400);
        }

        location.coords = {
            lat: loc.latitude,
            lng: loc.longitude,
        };

        return location;
    } catch (error) {
        console.error("Error al geocodificar la dirección: ", error);
        throw new CustomError("Dirección no encontrada", 400);
    }
}

export function milisecondsToMinutesOrHours(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    if (minutes > 120) {
        const hours = (minutes / 60).toFixed(2);
        return `${hours} horas`;
    }
    return `${minutes} minutos`;
}