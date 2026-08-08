const OWNER = "SRJ-v2";
const REPO = "MeshGarage";

const API_URL =
    `https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=100`;



async function loadReleaseData() {

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `GitHub API error: ${response.status}`
            );

        }


        const releases =
            await response.json();


        const published =
            releases.filter(
                release => !release.draft
            );


        if (!published.length) {

            throw new Error(
                "No published releases found"
            );

        }



        /* Latest release */

        const latest =
            published[0];



        /* Find installer */

        const installer =
            latest.assets.find(
                asset =>
                    /setup.*\.exe$/i.test(
                        asset.name
                    )
            );



        /* Find portable */

        const portable =
            latest.assets.find(
                asset =>
                    /portable.*\.zip$/i.test(
                        asset.name
                    )
            );



        /* Display release name */

        document.getElementById(
            "version"
        ).textContent =
            latest.name ||
            latest.tag_name;



        /* Installer buttons */

        if (installer) {

            enableButton(
                "installer-download",
                installer.browser_download_url
            );


            enableButton(
                "installer-download-bottom",
                installer.browser_download_url
            );

        }



        /* Portable buttons */

        if (portable) {

            enableButton(
                "portable-download",
                portable.browser_download_url
            );


            enableButton(
                "portable-download-bottom",
                portable.browser_download_url
            );

        }



        /* Total downloads */

        let totalDownloads = 0;


        published.forEach(
            release => {

                release.assets.forEach(
                    asset => {

                        const isInstaller =
                            /setup.*\.exe$/i.test(
                                asset.name
                            );


                        const isPortable =
                            /portable.*\.zip$/i.test(
                                asset.name
                            );


                        if (
                            isInstaller ||
                            isPortable
                        ) {

                            totalDownloads +=
                                asset.download_count || 0;

                        }

                    }
                );

            }
        );



        document.getElementById(
            "download-count"
        ).textContent =
            totalDownloads.toLocaleString();


    }


    catch (error) {


        console.error(
            "Unable to load MeshGarage release:",
            error
        );


        document.getElementById(
            "version"
        ).textContent =
            "MeshGarage Beta";


        document.getElementById(
            "download-count"
        ).textContent =
            "—";

    }

}



/* Enable download link */

function enableButton(
    elementId,
    downloadUrl
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {

        return;

    }


    element.href =
        downloadUrl;


    element.classList.remove(
        "disabled"
    );

}



loadReleaseData();
