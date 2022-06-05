export const Shaders = () => {
    const vertex = `
        struct Output {
            @builtin(position) Position: vec4<f32>,
            @location(0) vColor: vec4<f32>,
        };

        @group(0) @binding(1)
        var<storage> color: array<vec3<f32>, 3>;

        @stage(vertex)
        fn main(@builtin(vertex_index) VertexIndex: u32) -> Output {
            var pos = array<vec2<f32>, 3>(
                vec2<f32>(0.0, 0.5),
                vec2<f32>(-0.5, -0.5),
                vec2<f32>(0.5, -0.5)
            );


            var output: Output;
            output.Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
            output.vColor = vec4<f32>(color[VertexIndex], 1.0);
            return output;
        }
    `;

    const fragment = `
        @stage(fragment)
        fn main(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
            return color;
        }
    `;
    return {vertex, fragment};
}

export const Shaders1 = (color:Float32Array) => {
    const vertex = `
        let pos: array<vec2<f32>, 3> = array<vec2<f32>, 3>(
            vec2<f32>(0.0, 0.5),
            vec2<f32>(-0.5, -0.5),
            vec2<f32>(0.5, -0.5));
        @stage(vertex)
        fn main(@builtin(vertex_index) VertexIndex: u32) -> @builtin(position) vec4<f32> {
            return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
        }
    `;

    const fragment = `
        @stage(fragment)
        fn main() -> @location(0) vec4<f32> {
            return vec4<f32>(${color[0].toFixed(2)}, ${color[1].toFixed(2)}, ${color[2].toFixed(2)}, ${color[3].toFixed(2)});
        }
    `;
    return {vertex, fragment};
}

export const ShadersOld = (color:Float32Array) => {
    const vertex = `
        const pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
            vec2<f32>(0.0, 0.5),
            vec2<f32>(-0.5, -0.5),
            vec2<f32>(0.5, -0.5));
        [[builtin(position)]] var<out> Position : vec4<f32>;
        [[builtin(vertex_idx)]] var<in> VertexIndex : i32;
        [[stage(vertex)]]
        fn main() -> void {
            Position = vec4<f32>(pos[VertexIndex], 0.0, 1.0);
            return;
        }
    `;

    const fragment = `
        [[location(0)]] var<out> outColor : vec4<f32>;
        [[stage(fragment)]]
        fn main() -> void {
            outColor = vec4<f32>(${color[0].toFixed(2)}, ${color[1].toFixed(2)}, ${color[2].toFixed(2)}, ${color[3].toFixed(2)});
            return;
        }
    `;
    return {vertex, fragment};
}