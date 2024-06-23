#!/usr/bin/perl
use strict;
use warnings;
use File::Path qw(make_path);
use File::Basename qw(dirname);

my $input_file = 'nextjs-admin-interface.js';  # Change this to your input file name
my $current_file = '';
my $content = '';

open my $fh, '<', $input_file or die "Cannot open file '$input_file': $!";

while (my $line = <$fh>) {
    if ($line =~ /^\/\/ (.+)$/) {
        # New file encountered, write the previous file if any
        write_file($current_file, $content) if $current_file;
        
        $current_file = $1;
        $content = '';
    } else {
        $content .= $line;
    }
}

# Write the last file
write_file($current_file, $content) if $current_file;

close $fh;

sub write_file {
    my ($file_path, $content) = @_;
    
    # Create directory if it doesn't exist
    my $dir = dirname($file_path);
    make_path($dir) unless -d $dir;
    
    # Write content to file
    open my $out_fh, '>', $file_path or die "Cannot open file '$file_path' for writing: $!";
    print $out_fh $content;
    close $out_fh;
    
    print "Created file: $file_path\n";
}

print "File splitting complete.\n";
