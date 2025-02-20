import React from "react";
import {Elevation} from "../maps/elevation.tsx";
import {Menu} from "@base-ui-components/react";
import styles from './index.module.css';

export const Draw = React.memo(() => {
    return (
        <div className="relative flex flex:col flex:1 bl:2px|dotted|#0F0D0E">
            <div
                className="absolute top:0 left:0 right:0 bottom:0 flex flex:1 flex:col justify-content:center align-items:center overflow:auto">
                <Elevation withReduceSize={false}/>

                <div className="absolute bottom:0 right:0">
                    <Menu.Root>
                        <Menu.Trigger className={styles.Button}>
                            Layers <ChevronDownIcon className={styles.ButtonIcon}/>
                        </Menu.Trigger>
                        <Menu.Portal>
                            <Menu.Positioner className={styles.Positioner} sideOffset={8}>
                                <Menu.Popup className={styles.Popup}>
                                    <Menu.Arrow className={styles.Arrow}>
                                        <ArrowSvg/>
                                    </Menu.Arrow>

                                    <Menu.Item className={styles.Item}>Elevation</Menu.Item>
                                    <Menu.Item className={styles.Item}>Tectonics</Menu.Item>
                                    <Menu.Item className={styles.Item}>Temperature</Menu.Item>
                                    <Menu.Item className={styles.Item}>Wind</Menu.Item>
                                    <Menu.Item className={styles.Item}>Humidity</Menu.Item>
                                    <Menu.Item className={styles.Item}>Biome</Menu.Item>
                                    <Menu.Item className={styles.Item}>Photo</Menu.Item>
                                </Menu.Popup>
                            </Menu.Positioner>
                        </Menu.Portal>
                    </Menu.Root>
                </div>

                {/*<div className="flex flex:row">*/}
                {/*    <Elevation withReduceSize/>*/}
                {/*    <Tectonics withReduceSize/>*/}
                {/*    <Temperature withReduceSize/>*/}
                {/*    <Wind withReduceSize/>*/}
                {/*    <Humidity withReduceSize/>*/}
                {/*    <Biome withReduceSize/>*/}
                {/*    <Photo withReduceSize/>*/}
                {/*</div>*/}
            </div>
        </div>
    )
})

function ArrowSvg(props: React.ComponentProps<'svg'>) {
    return (
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
            <path
                d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                className={styles.ArrowFill}
            />
            <path
                d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                className={styles.ArrowOuterStroke}
            />
            <path
                d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
                className={styles.ArrowInnerStroke}
            />
        </svg>
    );
}

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
            <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5"/>
        </svg>
    );
}