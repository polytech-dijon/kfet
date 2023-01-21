import fetch from "isomorphic-unfetch"

export type UBSearchResult = {
  id: string;
  label: string;
  type: string;
  icon: string;
  thumbnailUrl: string;
  url: string;
}

export default async function findUBName(search: string): Promise<UBSearchResult | null> {
  try {
    const res = await fetch("https://nuxeo.u-bourgogne.fr/nuxeo/view_documents.faces");
    const cookies = res.headers.get("set-cookie") || "";
    await fetch("https://nuxeo.u-bourgogne.fr/nuxeo/view_documents.faces", {
      headers: {
        cookie: cookies
      }
    })

    const JSESSIONID = cookies.split(";")[0]

    const userInfos = await fetch("https://nuxeo.u-bourgogne.fr/nuxeo/site/automation/Search.SuggestersLauncher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": JSESSIONID,
      },
      body: JSON.stringify({
        params: {
          searchTerm: search,
        },
      })
    })
      .then((res) => res.json())

    if (userInfos.length === 0)
      return null

    return userInfos[0]
  }
  catch {
    return null
  }
}