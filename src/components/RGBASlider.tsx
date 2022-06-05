import React from "react";
import { Flex, Grid, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tag } from "@chakra-ui/react";

export enum RGBA {
    R = 0,
    G = 1,
    B = 2,
    A = 3,
}
type RGBASliderProps = { 
    channel: RGBA,
    color: Float32Array,
    setColor: (channels: Float32Array) => void
};

const RGBASlider: React.FC<RGBASliderProps> = ({ channel, color, setColor }) => {
    const setChannel = (val: number) => {
        let idx = channel.valueOf();
        color[idx] = val;
        setColor(color);
    };

    return (
        <Flex margin='1em'>
            <Tag size="md" variant='solid' colorScheme='purple' width='7vw'> 
                { toTag(channel) } 
            </Tag>
            <Slider 
                min={0.0} max={1.0} step={0.01}
                defaultValue={color[channel.valueOf()]} 
                onChange={(val) => setChannel(val)}
                colorScheme='purple'
            >
                <SliderTrack>
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </Flex >
    )
}

const toTag = (channel: RGBA) =>  {
    switch (channel) {
        case 0: return 'Red';
        case 1: return 'Green';
        case 2: return 'Blue';
        case 3: return 'Alpha';
    }
}

export default RGBASlider;