# _plugins/generate_heatmap_data.rb

require 'json'
require 'fileutils'

module Jekyll
  class GenerateHeatmapData < Generator
    safe true

    def generate(site)
      posts_path = "_posts"
      heatmap_data = Hash.new(0)

      Dir.glob("#{posts_path}/*.md").each do |file|
        date = File.basename(file)[0..9]
        heatmap_data[date] += 1
      end

      FileUtils.mkdir_p("assets/data")
      File.open("assets/data/heatmap_data.json", "w") do |f|
        f.write(JSON.pretty_generate(heatmap_data))
      end
    end
  end
end
