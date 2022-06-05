import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Container, Box, Slider, SliderMark, useSafeLayoutEffect, SliderTrack, SliderFilledTrack, SliderThumb, Center, Flex } from '@chakra-ui/react'

import { jsx, css, Global, ClassNames } from '@emotion/react'

import { CheckWebGPU } from '@/helper';
import { Shaders, Shaders1 } from '@/shaders';
import { ChromePicker, Color, ColorResult } from 'react-color'

type GPUState = {
    device: GPUDevice;
    context: GPUCanvasContext;
    format: GPUTextureFormat;
    vertexBuffer: GPUBuffer;
    colorBuffer: GPUBuffer;
};

type CanvasProps = {
    width: number,
    height: number,
}

const Canvas: React.FC<CanvasProps> = ({width, height}) => {

    const canvas = useRef<HTMLCanvasElement>(null);
    const [color1, setColor1] = useState(Float32Array.of(1.0, 0.0, 0.0, 1.0));
    const [color2, setColor2] = useState(Float32Array.of(0.0, 1.0, 0.0, 1.0));
    const [color3, setColor3] = useState(Float32Array.of(0.0, 0.0, 1.0, 1.0));
    const [gpu, setGpu] = useState<GPUState | undefined>(undefined);

    const colorPickerCallback = 
        (setColor: React.Dispatch<React.SetStateAction<Float32Array>>) => 
        (color: ColorResult, event: React.ChangeEvent<HTMLInputElement>): void => 
    {
        event.preventDefault();
        let {r, g, b, a} = color.rgb;
        if (!r || !g || !b || !a) return;
        setColor(Float32Array.of(r / 255.0, g / 255.0, b / 255.0, a / 255.0));
    }

    useEffect(() => {
        if (!canvas.current) return;
        init(canvas.current, setGpu);
    }, []);

    useEffect(() => {
        if (!gpu) return;
        render(color1, color2, color3, gpu);
    });
    
    return (
        <Container centerContent>
            <Box width={width + 30} height={height + 30} marginBottom='1em' borderWidth='15px' borderColor='purple.900' borderRadius='1em'>
                <canvas width={width} height={height} ref={canvas} ></canvas>
            </Box>
            <Container background='purple.700' padding='0.5em' borderWidth='0.2em' borderRadius='1em' borderColor='purple.500'>
                <Flex direction='row'>
                <ChromePicker color={numToColor(color1)} onChange={colorPickerCallback(setColor1)} />
                <ChromePicker color={numToColor(color2)} onChange={colorPickerCallback(setColor2)} />
                <ChromePicker color={numToColor(color3)} onChange={colorPickerCallback(setColor3)} />
                </Flex>
            </Container>
        </Container>
    )
};

const init = (
    canvas: HTMLCanvasElement, 
    setGpu: React.Dispatch<React.SetStateAction<GPUState | undefined>>
) => {
    if(CheckWebGPU().includes('Your current browser does not support WebGPU!')){
        console.log(CheckWebGPU());
        throw('Your current browser does not support WebGPU!');
    }
    
    navigator.gpu?.requestAdapter().then((adapter: GPUAdapter | null) => {
        adapter?.requestDevice().then((device: GPUDevice) => {
            if (!canvas) throw "missing canvas";

            const format = 'bgra8unorm';
            const context = canvas.getContext('webgpu') as unknown as GPUCanvasContext;
            context.configure({
                device: device, format: format
            });
            
            const vertexBuffer = device.createBuffer({
                size: 3 * 4,
                usage: GPUBufferUsage.UNIFORM
            });
    
            const colorBuffer = device.createBuffer({
                size: 3 * 4 * 4,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            })

            setGpu({device, context, format, vertexBuffer, colorBuffer});
        });
    });
}

const render = (
    color1: Float32Array,
    color2: Float32Array, 
    color3: Float32Array, 
    gpu: GPUState
) => {
    const shader = Shaders();
        if (!gpu) return;
        const pipeline = gpu.device.createRenderPipeline({
            vertex: {
                module: gpu.device.createShaderModule({                    
                    code: shader.vertex
                }),
                entryPoint: "main",
            },
            fragment: {
                module: gpu.device.createShaderModule({                    
                    code: shader.fragment
                }),
                entryPoint: "main",
                targets: [{
                    format: gpu.format as GPUTextureFormat
                }],
            },
            primitive:{
               topology: "triangle-list",
            },
            layout: gpu.device.createPipelineLayout({
                bindGroupLayouts: [
                    gpu.device.createBindGroupLayout({
                        entries: [
                            {
                                binding: 0,
                                // One or more stage flags, or'd together
                                visibility: GPUShaderStage.VERTEX,
                                buffer: { type: 'uniform', minBindingSize: 12 }
                            },

                            {
                                binding: 1,
                                visibility: GPUShaderStage.VERTEX,
                                buffer: { type: 'read-only-storage', minBindingSize: 3 * 4 * 4 }
                            }
                        ]
                    }),
                ]
            })
        });

        const bindGroup = gpu.device.createBindGroup({
            layout: pipeline.getBindGroupLayout(0),
            entries: [
                { binding: 0, resource: { buffer: gpu.vertexBuffer } },
                { binding: 1, resource: { buffer: gpu.colorBuffer } },
            ]
        });

        const commandEncoder = gpu.device.createCommandEncoder();
        const textureView = gpu.context.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: textureView,
                loadOp: 'clear',
                clearValue: { r: 0.19607843137, g: 0.14901960784, b: 0.34901960784, a: 1.0 }, //background color
                storeOp: 'store'
            }],
        });
        renderPass.setBindGroup(0, bindGroup);
        renderPass.setPipeline(pipeline);
        renderPass.draw(3);
        renderPass.end();

        gpu.device.queue.writeBuffer(gpu.colorBuffer, 0, float32ArrayContaining(color1, color2, color3));
        gpu.device.queue.submit([commandEncoder.finish()]);
}

const float32ArrayContaining = (
    ...arrays: Float32Array[]
): Float32Array => {
    if (arrays.length == 0) return Float32Array.from([]);
    const head = arrays[0];
    const tail = float32ArrayContaining(...arrays.slice(1));
    const size = head.length + tail.length;
    const result = new Float32Array(size);
    result.set(arrays[0]);
    result.set(tail, head.length);

    return result;
};

const numToColor = (
    arr: Float32Array
): Color => {
    const color: Color = {r: arr[0] * 255, g: arr[1] * 255, b: arr[2] * 255, a: arr[3] * 255};
    return color;
}

export default Canvas;