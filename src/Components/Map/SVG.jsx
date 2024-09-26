export default function CustomSVG() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000" style={{ position: 'absolute', top: 0, left: 0, zIndex:1000 }}>
            <g>
                <path 
                    className="leaflet-interactive" 
                    stroke="#3388ff" 
                    strokeOpacity="1" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    fill="#3388ff" 
                    fillOpacity="0.2" 
                    fillRule="evenodd" 
                    d="M999 633L1003 629L1002 628L1007 621L1006 618L1004 618L1004 612L1010 606L1006 606L1002 603L999 604L999 602L997 602L992 597L992 595L990 595L986 591L985 592L985 586L982 585L980 579L977 588L974 589L974 587L971 590L969 590L970 591L968 591L969 594L967 596L963 596L962 601L966 606L969 607L967 609L969 611L964 612L964 614L966 614L963 619L964 622L961 623L969 631L974 632L977 635L979 633L981 635L985 635L992 638L996 636L997 633L999 633z"
                ></path>
            </g>
        </svg>
    );
};
